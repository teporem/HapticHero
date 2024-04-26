import analogio
import sys
from board import VOLTAGE_MONITOR
import board
import digitalio
import time

import busio

# List of potential I2C busses
from adafruit_ble import BLERadio
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.services.circuitpython import CircuitPythonService
from adafruit_airlift.esp32 import ESP32

from adafruit_ble.advertising import Advertisement
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement


led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = True


esp32 = ESP32(
   reset=board.GP16,
   gpio0=board.GP9,
   busy=board.GP14,
   chip_select=board.GP13,
   tx=board.GP0,
   rx=board.GP1,
)

adapter = esp32.start_bluetooth()
ble = BLERadio(adapter)
uart = UARTService()
advertisement = ProvideServicesAdvertisement(uart)
scan_response = Advertisement()
scan_response.complete_name = "Haptic Hero Controller"

# List of potential I2C busses
ALL_I2C = ("board.I2C()", "board.STEMMA_I2C()", "busio.I2C(board.GP27, board.GP26)")

# Determine which busses are valid
found_i2c = []
for name in ALL_I2C:
    try:
        print("Checking {}...".format(name), end="")
        bus = eval(name)
        bus.unlock()
        found_i2c.append((name, bus))
        print("ADDED.")
    except Exception as e:
        print("SKIPPED:", e)

# Scan valid busses
if len(found_i2c):
    print("-" * 40)
    print("I2C SCAN")
    print("-" * 40)
    while True:

        ble.start_advertising(advertisement, scan_response)
        print("waiting to connect")
        while not ble.connected:
            pass
        print("connected: trying to read input")
        while ble.connected:
            print("sys.implementation:{}".format(sys.implementation))
            print("sys.version:{}".format(sys.version))
            pin = analogio.AnalogIn(VOLTAGE_MONITOR)
            adc_reading  = pin.value
            adc_voltage  = (adc_reading * pin.reference_voltage) / 65535
            vsys_voltage = adc_voltage * 3
            #if vsys_voltage < 3:
            print("""ADC reading:{}
            ADC voltage:{}
            VSYS voltage:{}""".format(adc_reading, adc_voltage, vsys_voltage))
            pin.deinit()
            # Returns b'' if nothing was read.
            #uart.write(str(vsys_voltage))
            time.sleep(2)
            for bus_info in found_i2c:
                name = bus_info[0]
                bus = bus_info[1]

                while not bus.try_lock():
                    pass
                txt = str([hex(device_address) for device_address in bus.scan()])
                uart.write(txt)
                print(
                    name,
                    "addresses found:",
                    [hex(device_address) for device_address in bus.scan()],
                )

            bus.unlock()

        time.sleep(2)
else:
    print("No valid I2C bus found.")


'''
while True:
    print("sys.implementation:{}".format(sys.implementation))
    print("sys.version:{}".format(sys.version))
    pin = analogio.AnalogIn(VOLTAGE_MONITOR)
    adc_reading  = pin.value
    adc_voltage  = (adc_reading * pin.reference_voltage) / 65535
    vsys_voltage = adc_voltage * 3
    #if vsys_voltage < 3:
        #led.value = False
    print("""ADC reading:{}
    ADC voltage:{}
    VSYS voltage:{}""".format(adc_reading, adc_voltage, vsys_voltage))
    pin.deinit()
    time.sleep(2)'''
