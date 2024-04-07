# Write your code here :-)
import board
import audioio
import time

# Configure the audio output
audio_pin = board.GP18  # Replace with the actual pin connected to the MAX98306
audio = audioio.AudioOut(audio_pin)

# Define the sample rate and audio buffer size
sample_rate = 44100
buffer_size = 1024

# Start the audio output
audio.play(audioio.RawSample(b'\x00' * buffer_size, sample_rate=sample_rate), loop=True)

# Main loop to receive and play audio data
while True:
    try:
        # Read audio data from the serial interface (adjust as needed)
        received_data = input().encode('latin-1')

        # Write the received data to the audio buffer
        audio.sample = audioio.RawSample(received_data, sample_rate=sample_rate)

    except KeyboardInterrupt:
        # Handle keyboard interrupt to stop the script
        break

# Cleanup
audio.stop()
