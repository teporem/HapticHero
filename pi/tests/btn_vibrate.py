import time
import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)
tca = adafruit_tca9548a.TCA9548A(i2c)

drv1 = adafruit_drv2605.DRV2605(tca[0])
drv2 = adafruit_drv2605.DRV2605(tca[1])

btn1 = digitalio.DigitalInOut(board.GP13)
btn1.switch_to_input(pull=digitalio.Pull.DOWN)
btn2 = digitalio.DigitalInOut(board.GP14)
btn2.switch_to_input(pull=digitalio.Pull.DOWN)

while True:
    if btn1.value:
        print("You pressed the first button!")
        drv1.sequence[0] = adafruit_drv2605.Effect(83)
        drv1.play()
        time.sleep(1)
        drv1.stop()
    if btn2.value:
        print("You pressed the second button!")
        drv2.sequence[0] = adafruit_drv2605.Effect(52)
        drv2.play()
        time.sleep(1)
        drv2.stop()

