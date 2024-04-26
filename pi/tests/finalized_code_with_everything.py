import board
import busio
import adafruit_tca9548a
import adafruit_drv2605
import digitalio
import asyncio

import audiopwmio
import audiocore

from adafruit_ble import BLERadio
from adafruit_ble.services.nordic import UARTService
from adafruit_ble.services.circuitpython import CircuitPythonService
from adafruit_airlift.esp32 import ESP32

from adafruit_ble.advertising import Advertisement
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

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
scan_response = Advertisement()
scan_response.complete_name = "Haptic Hero Controller"

# yellow = SCL
# i2c = busio.I2C(board.SCL, board.SDA)
i2c = busio.I2C(board.GP27, board.GP26)

tca = adafruit_tca9548a.TCA9548A(i2c)

drv1 = adafruit_drv2605.DRV2605(tca[0])
drv2 = adafruit_drv2605.DRV2605(tca[1])
drv3 = adafruit_drv2605.DRV2605(tca[2])
drv4 = adafruit_drv2605.DRV2605(tca[3])

btn1 = digitalio.DigitalInOut(board.GP18)
btn1.switch_to_input(pull=digitalio.Pull.UP)
btn2 = digitalio.DigitalInOut(board.GP19)
btn2.switch_to_input(pull=digitalio.Pull.UP)
btn3 = digitalio.DigitalInOut(board.GP20)
btn3.switch_to_input(pull=digitalio.Pull.UP)
btn4 = digitalio.DigitalInOut(board.GP21)
btn4.switch_to_input(pull=digitalio.Pull.UP)

#audio1 = audiopwmio.PWMAudioOut(board.GP5)
#audio2 = audiopwmio.PWMAudioOut(board.GP6)


async def connect_ble():
    while True:
        ble.start_advertising(advertisement, scan_response)
        print("waiting to connect")
        while not ble.connected:
            await asyncio.sleep(0.1)
        print("connected: trying to read input")
        while ble.connected:
            await asyncio.sleep(0.1)
        print("disconnected")
        # doesn't detect when disconnected

async def play_audio():
    decoder1 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    decoder2 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    audio1.play(decoder1)
    audio2.play(decoder2)
    while audio1.playing or audio2.playing:
        await asyncio.sleep(0.1)

async def check_buttons(button, i):
    while True:
        if not button.value:
            print(f"You pressed button {i}")
            uart.write(bytes([i]))
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.01)

async def check_vibrations():
    while True:
        if ble.connected:
            if uart.in_waiting > 0:
                one_byte = uart.read(1)
                #one_byte = ""
                if one_byte == b'A':
                    print("vibrate first")
                    drv1.sequence[0] = adafruit_drv2605.Effect(83)
                    drv1.play()
                    await asyncio.sleep(1)
                    drv1.stop()
                elif one_byte == b'B':
                    print("vibrate second")

                    drv2.sequence[0] = adafruit_drv2605.Effect(83)
                    drv2.play()
                    await asyncio.sleep(1)
                    drv2.stop()
                elif one_byte == b'C':
                    print("vibrate third")

                    drv3.sequence[0] = adafruit_drv2605.Effect(83)
                    drv3.play()
                    await asyncio.sleep(1)
                    drv3.stop()
                elif one_byte == b'D':
                    print("vibrate fourth")

                    drv4.sequence[0] = adafruit_drv2605.Effect(83)
                    drv4.play()
                    await asyncio.sleep(1)
                    drv4.stop()
        await asyncio.sleep(0.01)

led.value = True

async def main():
    tasks = [
        check_buttons(btn1, 4),
        check_buttons(btn2, 3),
        check_buttons(btn3, 2),
        check_buttons(btn4, 1),
        connect_ble(),
        check_vibrations()
    ]
    await asyncio.gather(*tasks)

asyncio.run(main())
