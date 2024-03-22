# Write your code here :-)
import board
import digitalio
import json
import time
import usb_cdc
led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
usb_cdc.data.timeout = 0.1


while True:

    led.value = True
    print("print works") # COM6
    usb_cdc.data.write("TEST".encode() + b"\r\n") #COM7

    time.sleep(0.1)
    led.value = False
    time.sleep(1)
