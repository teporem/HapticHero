import board
import audiomp3
import audiopwmio
import audiocore
import digitalio
import time
import usb_cdc

audio1 = audiopwmio.PWMAudioOut(board.GP11)
audio2 = audiopwmio.PWMAudioOut(board.GP12)

led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
usb_cdc.data.timeout = 0.1

def play_audio_stream():
    while usb_cdc.data.in_waiting > 0:
        data = usb_cdc.data.read(4096)  # Adjust buffer size as needed
        if data:
            decoder1 = audiocore.RawSample(data)
            decoder2 = audiocore.RawSample(data)
            #audio1.play(decoder1)
            #audio2.play(decoder2)
            usb_cdc.data.write(data + "\r\n")
            while audio1.playing or audio2.playing:
                pass
        else:
            break

while True:
    led.value = True
    play_audio_stream()
    print("Done playing!")
    led.value = False
    time.sleep(1)
