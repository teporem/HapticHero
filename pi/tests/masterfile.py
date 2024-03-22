import time
import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

import usb_cdc

# usb_cdc set up in boot.py
usb_cdc.data.timeout = 0.1

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)
tca = adafruit_tca9548a.TCA9548A(i2c)

# set up vibration motors
motors = [adafruit_drv2605.DRV2605(channel) for channel in tca.channels[:4]]

lock = asyncio.Lock()
async def play_vibration(motor_id, effect):
    async with lock:
        motor = motors[motor_id]
        motor.sequence[0] = adafruit_drv2605.Effect(effect)
        motor.play()
        await asyncio.sleep(1)
        motor.stop()

async def handle_messages():
    while True:
        try:
            if usb_cdc.data.in_waiting > 0:
                data = usb_cdc.data.read(usb_cdc.data.in_waiting)
                if data:
                    # ["M1:83", "M2:15", "M3:52", "M4:37"]
                    messages = data.decode("utf-8").split("\n")
                    for message in messages:
                        motor_id, effect = message.split(":")
                        motor_id = int(motor_id[-1]) - 1
                        effect = int(effect)
                        asyncio.create_task(play_vibration(motor_id, effect))
        except (UnicodeError, ValueError, IndexError):
            pass
        await asyncio.sleep(0.1)

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
loop.create_task(handle_messages())
loop.run_forever()
