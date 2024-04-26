import board
from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.services.circuitpython import CircuitPythonService
from adafruit_airlift.esp32 import ESP32

btn1 = digitalio.DigitalInOut(board.GP18)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP19)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP20)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP21)
btn4.switch_to_input(pull=digitalio.Pull.UP)

esp32 = ESP32(
   reset=board.GP16,
   gpio0=board.GP9,
   busy=board.GP14,
   chip_select=board.GP13,
   tx=board.GP0,
   rx=board.GP1,
)

adapter = esp32.start_bluetooth()
ble = BLERadio(adapter)
uart = UARTService()
advertisement = ProvideServicesAdvertisement(uart)

async def check_buttons(button, i):
    while True:
        if not button.value:
            print(f"You pressed button {i}")
            #uart.write("test".encode("utf-8"))
        await asyncio.sleep(0.01)

async def check_vibrations():
    while True:
        if ble.connected:
            one_byte = uart.read(1)
            if one_byte == b'A':
                print("vibrate first")
                '''
                drv1.sequence[0] = adafruit_drv2605.Effect(83)
                drv1.play()
                await asyncio.sleep(1)
                drv1.stop()'''
            elif one_byte == b'B':
                print("vibrate second")
                '''
                drv2.sequence[0] = adafruit_drv2605.Effect(83)
                drv2.play()
                await asyncio.sleep(1)
                drv2.stop()'''
            elif one_byte == b'C':
                print("vibrate third")
                '''
                drv3.sequence[0] = adafruit_drv2605.Effect(83)
                drv3.play()
                await asyncio.sleep(1)
                drv3.stop()'''
            elif one_byte == b'D':
                print("vibrate fourth")
                '''
                drv4.sequence[0] = adafruit_drv2605.Effect(83)
                drv4.play()
                await asyncio.sleep(1)
                drv4.stop()'''
        await asyncio.sleep(0.01)

async def main():
    tasks = [
        check_buttons(btn1, 0),
        check_buttons(btn2, 1),
        check_buttons(btn3, 2),
        check_buttons(btn4, 3),
        check_vibrations()
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
while True:
    ble.start_advertising(advertisement)
    print("waiting to connect")
    while not ble.connected:
        pass
    print("connected: trying to read input")
    while ble.connected:
        pass
