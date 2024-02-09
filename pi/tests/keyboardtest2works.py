import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import time

import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

# set up buttons as arrows
button_pins = [board.GP14, board.GP15, board.GP16, board.GP17]
buttons = [digitalio.DigitalInOut(pin) for pin in button_pins]
for button in buttons:
    button.switch_to_input(pull=digitalio.Pull.UP)
kbd = Keyboard(usb_hid.devices)
keys = [Keycode.UP_ARROW, Keycode.DOWN_ARROW, Keycode.LEFT_ARROW, Keycode.RIGHT_ARROW]


while True:
    # check button states
    button_states = [button.value for button in buttons]
    print(button_states)
    for i, state in enumerate(button_states):
        if not state:
            kbd.press(keys[i])
        else:
            kbd.release(keys[i])
    time.sleep(0.05)


