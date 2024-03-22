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

def receive_audio_chunk_from_serial():
    chunk = bytearray()
    while True:
        if usb_cdc.data.in_waiting > 0:
            byte = usb_cdc.data.read(1)
            if byte and byte[0] != b'\n':  # Assuming '\n' is the end-of-chunk marker
                chunk.extend(byte)
            else:
                break
    usb_cdc.data.write(chunk + "\r\n")
    return chunk

def play_audio_stream():
    while usb_cdc.data.in_waiting > 0:
        data = usb_cdc.data.read(1024)  # Adjust buffer size as needed
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

#while True:
 #   led.value = True
 #   play_audio_stream()
  # print("Done playing!")
   # led.value = False
   # time.sleep(1)

while True:
    chunk = receive_audio_chunk_from_serial()
    if chunk:
        # Convert chunk to audio sample
        decoder1 = audiocore.WaveFile(io.BytesIO(chunk))
        decoder2 = audiocore.WaveFile(io.BytesIO(chunk))
        #decoder1 = audiocore.RawSample(chunk, sample_rate=44100, channels=1)
        #decoder2 = audiocore.RawSample(chunk, sample_rate=44100, channels=1)
        # Play audio sample
        #audio1.play(decoder1, loop=False)
        #audio2.play(decoder2, loop=False)
        while audio1.playing or audio2.playing:
            pass  # Wait for audio to finish playing
    time.sleep(0)  # Adjust as needed to avoid overwhelming the serial connection
