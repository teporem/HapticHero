#
# SPDX-License-Identifier: MIT

import board
from adafruit_ble import BLERadio
from adafruit_ble.advertising import Advertisement
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.services.circuitpython import CircuitPythonService
from adafruit_airlift.esp32 import ESP32

# If you are using an AirLift Breakout, comment out the DEFAULT lines
# above and uncomment the lines below:
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
# CircuitPythonService:
# ADAF0201-4369-7263-7569-74507974686E

while True:
    ble.start_advertising(advertisement, scan_response)
    print("waiting to connect")
    while not ble.connected:
        pass
    print("connected: trying to read input")
    while ble.connected:
        # Returns b'' if nothing was read.
        one_byte = uart.read(1)
        if one_byte:
            print(one_byte)
            if one_byte == b'A':
                uart.write(bytes([1]))
            elif one_byte == b'B':
                uart.write(bytes([2]))
            elif one_byte == b'C':
                uart.write(bytes([3]))
            elif one_byte == b'D':
                uart.write(bytes([4]))

