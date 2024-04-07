import board
import audiomp3
import audiopwmio
import audiocore

audio = audiopwmio.PWMAudioOut(board.GP7)
audio2 = audiopwmio.PWMAudioOut(board.GP8)

def play_audio():
    decoder = audiocore.WaveFile(open("StreetChicken.wav", "rb"))
    decoder2 = audiocore.WaveFile(open("StreetChicken.wav", "rb"))

    audio.play(decoder)
    audio2.play(decoder2)

    while audio.playing or audio2.playing:
        pass

while True:
    play_audio()
    print("Done playing!")
