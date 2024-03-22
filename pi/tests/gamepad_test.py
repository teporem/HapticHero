#https://www.raspberrypi.com/news/custom-usb-games-controllers-with-raspberry-pi-pico-hackspace-42/
import board
import digitalio
import gamepad
import time
import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

kbd = Keyboard(usb_hid.devices)

keycodes = [Keycode.UP_ARROW, Keycode.DOWN_ARROW, Keycode.LEFT_ARROW, Keycode.RIGHT_ARROW, Keycode.X, Keycode.Z, Keycode.SPACE, Keycode.ENTER]

pad = gamepad.GamePad(
    digitalio.DigitalInOut(board.GP12),
    digitalio.DigitalInOut(board.GP14),
    digitalio.DigitalInOut(board.GP9),
    digitalio.DigitalInOut(board.GP15),
    digitalio.DigitalInOut(board.GP16),
    digitalio.DigitalInOut(board.GP17),
    digitalio.DigitalInOut(board.GP18),
    digitalio.DigitalInOut(board.GP20),
)
last_pressed = 0
while True:
    this_pressed = pad.get_pressed()
    if (this_pressed != last_pressed):
        for i in range(8):
            if (this_pressed & 1<<i) and not (last_pressed & 1<<i):
                kbd.press(keycodes[i])
            if (last_pressed & 1<<i) and not (this_pressed & 1<<i):
                kbd.release(keycodes[i])
        last_pressed = this_pressed
    time.sleep(0.01)# Write your code here :-)
