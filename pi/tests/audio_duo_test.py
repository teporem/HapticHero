import board
import audiomp3
import audiopwmio
import audiocore

audio = audiopwmio.PWMAudioOut(board.GP11)
audio2 = audiopwmio.PWMAudioOut(board.GP12)

decoder = audiocore.WaveFile(open("StreetChicken.wav", "rb"))

audio.play(decoder)
audio2.play(decoder)

while audio.playing or audio2.playing:
    pass

print("Done playing!")
