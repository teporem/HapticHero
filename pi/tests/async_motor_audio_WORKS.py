import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import audiopwmio
import audiocore

# https://learn.adafruit.com/adafruit-tca9548a-1-to-8-i2c-multiplexer-breakout/overview

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)
#drv = adafruit_drv2605.DRV2605(i2c)

tca = adafruit_tca9548a.TCA9548A(i2c)

drv1 = adafruit_drv2605.DRV2605(tca[0])
drv2 = adafruit_drv2605.DRV2605(tca[1])
drv3 = adafruit_drv2605.DRV2605(tca[2])
drv4 = adafruit_drv2605.DRV2605(tca[3])

btn1 = digitalio.DigitalInOut(board.GP12)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP13)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP14)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP15)
btn4.switch_to_input(pull=digitalio.Pull.UP)

audio1 = audiopwmio.PWMAudioOut(board.GP5)
audio2 = audiopwmio.PWMAudioOut(board.GP6)

async def play_audio():
    decoder1 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    decoder2 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    audio1.play(decoder1)
    audio2.play(decoder2)
    while audio1.playing or audio2.playing:
        await asyncio.sleep(0.1)

async def check_buttons(button, drv, num):
    while True:
        if not button.value:
            print(f"You pressed the " + num + " button!")
            if num == "fourth":
                await play_audio()
            else:
                drv.sequence[0] = adafruit_drv2605.Effect(83)
                drv.play()
                await asyncio.sleep(1)
                drv.stop()
        await asyncio.sleep(0.01)

async def main():
    tasks = [
        check_buttons(btn1, drv1, "first"),
        check_buttons(btn2, drv2, "second"),
        check_buttons(btn3, drv3, "third"),
        check_buttons(btn4, drv4, "fourth")
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
