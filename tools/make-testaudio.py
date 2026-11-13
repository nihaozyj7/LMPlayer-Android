#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate small sine-wave WAV files used to smoke-test library scanning/playback."""

import math
import os
import struct
import wave

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".testaudio")


def tone(name, freqs, secs=6.0, sr=44100):
    path = os.path.join(OUT, name)
    w = wave.open(path, "wb")
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(sr)
    frames = bytearray()
    for i in range(int(sr * secs)):
        t = i / sr
        v = sum(math.sin(2 * math.pi * f * t) for f in freqs) / len(freqs)
        s = int(v * 8000)
        frames += struct.pack("<hh", s, s)
    w.writeframes(bytes(frames))
    w.close()
    print("wrote", path)


def main():
    os.makedirs(OUT, exist_ok=True)
    tone("Night Flight.wav", [220, 277], 6)
    tone("Rooftop Rain.wav", [330, 415], 8)
    tone("Glass Sea.wav", [262, 392], 5)


if __name__ == "__main__":
    main()
