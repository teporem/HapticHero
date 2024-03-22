# Write your code here :-)
# SPDX-FileCopyrightText: 2021 Kattni Rembor for Adafruit Industries
#
# SPDX-License-Identifier: MIT

"""
CircuitPython single MP3 playback example for Raspberry Pi Pico.
Plays a single MP3 once.
"""
import board
import audiomp3
import audiopwmio
import audiocore
import asyncio

async def play_audio(pin):
    audio = audiopwmio.PWMAudioOut(pin)
    decoder = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    audio.play(decoder)
    while audio.playing:
        pass
    await asyncio.sleep(0.1)

loop = asyncio.get_event_loop()
loop.create_task(play_audio(board.GP10))
loop.create_task(play_audio(board.GP11))
loop.run_forever()

"""
audio = audiopwmio.PWMAudioOut(board.GP10)
#audio2 = audiopwmio.PWMAudioOut(board.GP11)

#decoder = audiomp3.MP3Decoder(open("sample_song.mp3", "rb"))

decoder = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
#decoder2 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))

audio.play(decoder)
#audio2.play(decoder2)

while audio.playing:
    pass

print("Done playing!")
"""
