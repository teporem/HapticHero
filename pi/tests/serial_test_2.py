import board
import digitalio
import time
import usb_cdc

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
usb_cdc.data.timeout = 0.1

while True:

    led.value = True
    if usb_cdc.data.in_waiting > 0:
        data = usb_cdc.data.read(usb_cdc.data.in_waiting)
        usb_cdc.data.write(data + "\r\n")  # Echo received data
    #print("print works") # COM6
    #usb_cdc.data.write("TEST".encode() + b"\r\n") #COM7

    time.sleep(0.3)
    led.value = False
    time.sleep(0.3)
