import board
import digitalio
import audiocore
from audiopwmio import PWMAudioOut as AudioOut
import usb_cdc
import time

# Set timeout for USB communication
usb_cdc.data.timeout = 0.1

# Pin connected to the amplifier enable (EN) pin
amp_enable = digitalio.DigitalInOut(board.GP21)
amp_enable.direction = digitalio.Direction.OUTPUT
amp_enable.value = True  # Enable the amplifier

# Create an audio output object using the built-in speaker
audio_out = AudioOut(board.GP18)

# LED for visual indication
led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

def play_audio(data):
    # Add your audio playback logic here
    # For example, create an audio sample and play it
    audio_sample = audiocore.RawSample(data)
    audio_out.play(audio_sample, loop=False)
    while audio_out.playing:
        pass  # Wait for audio playback to finish

while True:
    led.value = True

    if usb_cdc.data.in_waiting > 0:
        data = usb_cdc.data.read(usb_cdc.data.in_waiting)
        usb_cdc.data.write(data + "\r\n\r\n")  # Echo received data

        # Check if the received data indicates audio
        if b'AUDIO_START' in data:
            # Extract the audio data (assuming a simple protocol)
            audio_data_start = data.find(b'AUDIO_START') + len(b'AUDIO_START')
            audio_data_end = data.find(b'AUDIO_END')
            audio_data = data[audio_data_start:audio_data_end]

            # Play the audio data
            play_audio(audio_data)

    time.sleep(0.3)
    led.value = False
    time.sleep(0.3)
