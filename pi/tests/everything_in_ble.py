import board
from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.services.circuitpython import CircuitPythonService
from adafruit_airlift.esp32 import ESP32
import digitalio
import time

btn1 = digitalio.DigitalInOut(board.GP18)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP19)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP20)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP21)
btn4.switch_to_input(pull=digitalio.Pull.UP)

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

while True:
    ble.start_advertising(advertisement)
    print("waiting to connect")
    while not ble.connected:
        pass
    print("connected: trying to read input")
    while ble.connected:
        # Returns b'' if nothing was read.
        one_byte = uart.read(1)
        #if one_byte:
            #print(one_byte)
        #    if one_byte == b'A':
        #        print("vibrate first")
        #    elif one_byte == b'B':
        #        print("vibrate second")
         #   elif one_byte == b'C':
        #        print("vibrate third")
        #    elif one_byte == b'D':
        #        print("vibrate fourth")
            # uart.write(one_byte)
        if not btn1.value:
            print("You pressed button 1")
        if not btn2.value:
            print("You pressed button 2")
        if not btn3.value:
            print("You pressed button 3")
        if not btn4.value:
            print("You pressed button 4")
