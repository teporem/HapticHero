import time
import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import audiopwmio
import audiocore

import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keycode import Keycode

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)
tca = adafruit_tca9548a.TCA9548A(i2c)

# set up vibration motors
#motors = [adafruit_drv2605.DRV2605(channel) for channel in tca.channels[:4]]

async def play_vibration(motor_id, effect):
    #motor = motors[motor_id]
    motor = adafruit_drv2605.DRV2605(tca[motor_id])
    motor.sequence[0] = adafruit_drv2605.Effect(effect)
    motor.play()
    await asyncio.sleep(1)
    motor.stop()

# set up buttons as arrows
button_pins = [board.GP12, board.GP13, board.GP14, board.GP15]
buttons = [digitalio.DigitalInOut(pin) for pin in button_pins]
for button in buttons:
    button.switch_to_input(pull=digitalio.Pull.UP)
kbd = Keyboard(usb_hid.devices)
keys = [Keycode.UP_ARROW, Keycode.DOWN_ARROW, Keycode.LEFT_ARROW, Keycode.RIGHT_ARROW]

async def play_audio():
    decoder1 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    decoder2 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))

    audio1.play(decoder1)
    audio2.play(decoder2)

    while audio1.playing or audio2.playing:
        pass

async def main():
    while True:
        # check button states
        button_states = [button.value for button in buttons]
        for i, state in enumerate(button_states):
            if not state:
                if i == 0:
                    audio_task = asyncio.create_task(play_audio())
                elif i == 1:
                    vibration_task1 = asyncio.create_task(play_vibration(i, 83))
                elif i == 2:

                kbd.press(keys[i])
            else:
                kbd.release(keys[i])
        await asyncio.sleep(0.05)

asyncio.run(main())
