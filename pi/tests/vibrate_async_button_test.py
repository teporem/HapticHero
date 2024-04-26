import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)

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

async def check_buttons(button, drv):
    while True:
        if not button.value:
            print(f"You pressed the button connected to {button}")
            drv.sequence[0] = adafruit_drv2605.Effect(83)
            drv.play()
            await asyncio.sleep(1)
            drv.stop()
        await asyncio.sleep(0.01)

async def main():
    tasks = [
        check_buttons(btn1, drv1),
        check_buttons(btn2, drv2),
        check_buttons(btn3, drv3),
        check_buttons(btn4, drv4)
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
