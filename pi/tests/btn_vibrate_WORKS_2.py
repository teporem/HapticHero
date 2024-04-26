import time
import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio

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

while True:
    if not btn1.value:
        print("You pressed the first button!")
        drv1.sequence[0] = adafruit_drv2605.Effect(83)
        drv1.play()
        time.sleep(1)
        drv1.stop()
    if not btn2.value:
        print("You pressed the second button!")
        drv2.sequence[0] = adafruit_drv2605.Effect(83)
        drv2.play()
        time.sleep(1)
        drv2.stop()
    if not btn3.value:
        print("You pressed the third button!")
        drv3.sequence[0] = adafruit_drv2605.Effect(83)
        drv3.play()
        time.sleep(1)
        drv3.stop()
    if not btn4.value:
        print("You pressed the fourth button!")
        drv4.sequence[0] = adafruit_drv2605.Effect(83)
        drv4.play()
        time.sleep(1)
        drv4.stop()
