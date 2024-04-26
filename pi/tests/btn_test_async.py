import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import audiopwmio
import audiocore

# https://learn.adafruit.com/adafruit-tca9548a-1-to-8-i2c-multiplexer-breakout/overview

btn1 = digitalio.DigitalInOut(board.GP18)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP19)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP20)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP21)
btn4.switch_to_input(pull=digitalio.Pull.UP)


async def check_buttons(button, num):
    while True:
        if not button.value:
            print(f"You pressed the " + num + " button!")
        await asyncio.sleep(0.01)

async def main():
    tasks = [
        check_buttons(btn1, "first"),
        check_buttons(btn2, "second"),
        check_buttons(btn3,"third"),
        check_buttons(btn4, "fourth")
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
