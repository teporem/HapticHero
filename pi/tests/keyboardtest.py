import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

# set up buttons as arrows
button_pins = [board.GP14, board.GP15, board.GP16, board.GP17]
buttons = [digitalio.DigitalInOut(pin) for pin in button_pins]
for button in buttons:
    button.switch_to_input(pull=digitalio.Pull.UP)
kbd = Keyboard(usb_hid.devices)
keys = [Keycode.UP_ARROW, Keycode.DOWN_ARROW, Keycode.LEFT_ARROW, Keycode.RIGHT_ARROW]

async def main():
    while True:
        # check button states
        button_states = [button.value for button in buttons]
        for i, state in enumerate(button_states):
            if state:
                kbd.press(keys[i])
            else:
                kbd.release(keys[i])
        await asyncio.sleep(0.05)

loop = asyncio.get_event_loop()
loop.create_task(main())
loop.run_forever()
