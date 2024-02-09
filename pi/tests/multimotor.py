import time
import board
import busio
import adafruit_tca9548a
import adafruit_drv2605

# https://learn.adafruit.com/adafruit-tca9548a-1-to-8-i2c-multiplexer-breakout/overview

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)
#drv = adafruit_drv2605.DRV2605(i2c)

tca = adafruit_tca9548a.TCA9548A(i2c)

drv1 = adafruit_drv2605.DRV2605(tca[0])
drv2 = adafruit_drv2605.DRV2605(tca[1])

while True:

    drv1.sequence[0] = adafruit_drv2605.Effect(83)
    #drv1.sequence[1] = adafruit_drv2605.Effect(37)
    #drv1.sequence[2] = adafruit_drv2605.Effect(37)
    drv2.sequence[0] = adafruit_drv2605.Effect(83) #15
    print("Playing first one".format(15))
    drv1.play()
    time.sleep(1)
    drv1.stop()
    time.sleep(1)
    print("Playing second time".format(52))
    drv2.play()
    time.sleep(1)
    drv2.stop()
