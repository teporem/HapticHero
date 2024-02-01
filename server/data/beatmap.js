import { readFileSync } from 'fs';
import Meyda from 'meyda';
import decode from 'audio-decode';
import path from 'path';
import { fileURLToPath } from 'url';
import esLib from 'essentia.js';
import {PolarFFTWASM} from '../lib/polarFFT.module.js';
import {OnsetsWASM} from '../lib/onsets.module.js';
import spleeter from './python_scripts.js';
import * as wav from 'node-wav';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// audio file --> audio buffer
const loadFile = async (filePath) => {
  try {
    const fileBuffer = readFileSync(filePath);
    return await decode(fileBuffer);
  } catch (error) {
    console.error('Error decoding file:', error);
    throw error; 
  }
}

const essentia = new esLib.Essentia(esLib.EssentiaWASM);

// works ish, not the best method
const findPitchThenOnset = (audioPath) => {
  console.log(`Analyzing ${audioPath}`);
  const fileBuffer = readFileSync(audioPath);
  const audioBuffer = wav.decode(fileBuffer);
  const audioVector = essentia.arrayToVector(audioBuffer.channelData[0]);
  const melodia = essentia.PredominantPitchMelodia(audioVector).pitch;
  const segments = essentia.PitchContourSegmentation(melodia, audioVector);
  return {
    audioPath,
    durations: essentia.vectorToArray(segments.duration),
    onsets: essentia.vectorToArray(segments.onset),
    pitches: essentia.vectorToArray(segments.MIDIpitch)
  };
}

// https://mtg.github.io/essentia.js/examples/demos/onsets/public/
// https://github.com/MTG/essentia.js/tree/dev/examples/demos/onsets

// TODO: Adjust settings as needed
// hopsize is percentage of frame size on demo
const params = {
  frameSize: 8192, //1024,
  hopSize: 2457.6, //512,
  odfs: ["complex"], //["hfc","complex"],
  odfsWeights: [1], //[0.5,0.5],
  sensitivity: 0.9 //0.65
};

const findOnsets = (buffer) => {
  // Calculate polar frames.
  const polarFrames = [];
  let PolarFFT = new PolarFFTWASM.PolarFFT(params.frameSize);
  let frames = essentia.FrameGenerator(buffer.channelData[0], params.frameSize, params.hopSize);
  for (let i = 0; i < frames.size(); i++) {
      let currentFrame = frames.get(i);
      let windowed = essentia.Windowing(currentFrame).frame;
      const polar = PolarFFT.compute(essentia.vectorToArray(windowed));
      polarFrames.push(polar);
  }
  frames.delete();
  PolarFFT.shutdown();
  // Calculate onsets.
  const alpha = 1 - params.sensitivity; 
  const Onsets = new OnsetsWASM.Onsets(alpha, 5, buffer.sampleRate / params.hopSize, 0.02); 
  const odfMatrix = [];
  for (const func of params.odfs) {
      const odfArray = polarFrames.map( (frame) => {
          return essentia.OnsetDetection(
              essentia.arrayToVector(essentia.vectorToArray(frame.magnitude)), 
              essentia.arrayToVector(essentia.vectorToArray(frame.phase)), 
              func, buffer.sampleRate).onsetDetection;
      });
      odfMatrix.push(Float32Array.from(odfArray));
  }
  const onsetPositions = Onsets.compute(odfMatrix, params.odfsWeights).positions;
  //console.log(onsetPositions);
  Onsets.shutdown();
  if (onsetPositions.size() == 0) { return new Float32Array(0) }
  else { return essentia.vectorToArray(onsetPositions); }
}

const findPitches = (onsets, buffer) => {
  const audioVector = essentia.arrayToVector(buffer.channelData[0]);
  const sampleRate = buffer.sampleRate; 
  const frameSize = params.frameSize;
  const hopSize = params.hopSize;  

  /* prefer to use a pitch detection method using essentia if possible
  const pitchMelodia = new essentia.PitchMelodia(audioVector, sampleRate, frameSize, hopSize);
  // Process onset data and estimate pitches
  const pitches = onsets.map((onsetTime) => {
    const pitch = pitchMelodia.process(onsetTime);
    return pitch;
  });
  console.log('Estimated Pitches:', pitches);*/

  let results = [];
  // Extract pitch using Meyda
  const timeIntervalsInSamples = onsets.map(time => Math.round(time * sampleRate));
  timeIntervalsInSamples.forEach(startTime => {
    if (startTime+params.frameSize < buffer.channelData[0].length) {
      const frame = buffer.channelData[0].slice(startTime, startTime + params.frameSize);
      const pitch = Meyda.extract('chroma', frame, sampleRate);
      // pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] from scale of 0 to 1 per chromatic pitch class
      // https://meyda.js.org/audio-features
      results.push(pitch);
    } else {
      results.push([0,0,0,0,0,0,0,0,0,0,0,0]);
    }
  });
  //console.log('Pitch Results:', results);
  let chroma_results = [];
  results.forEach((chroma) => {
    chroma_results.push(chroma.indexOf(Math.max(...chroma)));
  });
  //console.log(chroma_results);
  return chroma_results;
}

const createBeatmap = (onsets, pitches) => {
  const min = Math.min(...pitches);
  const max = Math.max(...pitches);
  const range = (max - min) / 4;
  let beatmap = {};

  for (let i in onsets) {
    if (pitches[i] < min + range) {
      beatmap[onsets[i]] = "A";
    } else if (pitches[i] < max - range * 2) {
      beatmap[onsets[i]] = "B";
    } else if (pitches[i] < max - range) {
      beatmap[onsets[i]] = "C";
    } else {
      beatmap[onsets[i]] = "D";
    }
  }
  
  return beatmap;
};
  
// analyzes audio and returns formatted data
const analyzeAudio = async (filePath) => {
  try {
    const bufferSize = 512;

    //const audioPath = path.join(__dirname, filePath);
    //const audioBuffer = await loadFile(audioPath);
    //console.log(audioBuffer);

    const audioPath = path.join(__dirname, filePath);
    console.log(`Analyzing ${audioPath}`);
    const result = await spleeter(audioPath);
    console.log("spleeter done")
    const fileBuffer = readFileSync(audioPath);
    const audioBuffer = wav.decode(fileBuffer);
    //const audioBuffer = await loadFile(audioPath); uses _channelData

    /* Might Need ?
    // Optional: downmix stereo audio to mono
    // We use MonoMixer algorithm from Essentia for that.
    // We need to convert audio data into 
    const audioLeftChannelData = essentia.arrayToVector(audio.channelData[0]);
    const audioRightChannelData = essentia.arrayToVector(audio.channelData[1]);
    const audioDownMixed = essentia.MonoMixer(audioLeftChannelData, audioRightChannelData).audio;
    const audioData = essentia.vectorToArray(audioDownMixed);
    */ 

    const onsets = findOnsets(audioBuffer);
    const onsetsMilliseconds = onsets.map(seconds => seconds * 1000);
    //console.log(onsetsMilliseconds);

    const pitches = findPitches(onsets, audioBuffer);
    const beatmap = createBeatmap(onsetsMilliseconds, pitches);
    //console.log(beatmap);
    return beatmap;
  } catch (error) {
    throw `Error: ${error.message}`;
  }
};

export default analyzeAudio;
