# SPDX-FileCopyrightText: 2020 John Park for Adafruit Industries
#
# SPDX-License-Identifier: MIT

"""
This example acts as a BLE HID keyboard to peer devices.
Attach five buttons with pullup resistors to Feather nRF52840
  each button will send a configurable keycode to mobile device or computer
"""
import time
import board
import digitalio
# Uncomment if setting .pull below.
# from digitalio import Pull
from adafruit_airlift.esp32 import ESP32

import adafruit_ble
from adafruit_ble.advertising import Advertisement
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.standard.hid import HIDService
from adafruit_ble.services.standard.device_info import DeviceInfoService
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode

esp32 = ESP32(
   reset=board.GP16,
   gpio0=board.GP9,
   busy=board.GP14,
   chip_select=board.GP13,
   tx=board.GP0,
   rx=board.GP1,
)
adapter = esp32.start_bluetooth()


btn1 = digitalio.DigitalInOut(board.GP18)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP19)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP20)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP21)
btn4.switch_to_input(pull=digitalio.Pull.UP)

hid = HIDService()

device_info = DeviceInfoService(software_revision=adafruit_ble.__version__,manufacturer="Adafruit Industries")
advertisement = ProvideServicesAdvertisement(hid)
advertisement.appearance = 961
scan_response = Advertisement()
scan_response.complete_name = "CIRCUITPY015a"

ble = adafruit_ble.BLERadio(adapter)
if not ble.connected:
    print("advertising")
    ble.start_advertising(advertisement, scan_response)
else:
    print("already connected")
    print(ble.connections)

k = Keyboard(hid.devices)
kl = KeyboardLayoutUS(k)
while True:
    print("Not connected")
    while not ble.connected:
        pass
    print("Start typing:")

    while ble.connected:
        if not btn1.value:  # pull up logic means button low when pressed
            #print("back")  # for debug in REPL
            k.send(Keycode.L)
            kl.write("Bluefruit")
            print("up?")
            time.sleep(0.1)

        if not btn2.value:
            k.send(Keycode.DOWN_ARROW)
            print("down?")
            time.sleep(0.4)

        if not btn3.value:
            k.send(Keycode.LEFT_ARROW)
            print("left?")
            time.sleep(0.4)

        if not btn4.value:
            k.send(Keycode.RIGHT_ARROW)
            print("right?")
            time.sleep(0.4)


    ble.start_advertising(advertisement)
