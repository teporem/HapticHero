import { readFileSync } from 'fs';
import Meyda from 'meyda';
import decode from 'audio-decode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// audio file --> audio buffer
const loadFile = async (filePath) => {
  const fileBuffer = readFileSync(filePath);
  return await decode(fileBuffer);
};

// find notes by onset detection, there might be better options
const findNoteOnsets = (loudnessData) => {
    const thresholdMultiplier = 0.1; // Adjust as needed
    const smoothedLoudness = smoothData(loudnessData, 5); // Adjust smoothing window size

    const maxLoudness = Math.max(...smoothedLoudness);
    const threshold = maxLoudness * thresholdMultiplier;

    const noteOnsets = [];

    for (let i = 1; i < smoothedLoudness.length; i++) {
      const currentLoudness = smoothedLoudness[i];
      const previousLoudness = smoothedLoudness[i - 1];

      // check by loudness
      if (currentLoudness - previousLoudness > threshold) {
        noteOnsets.push(i);
      }
    }

    return noteOnsets;
};

// Example smoothing function (you can use other smoothing techniques)
const smoothData = (data, windowSize) => {
    const smoothed = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));
        const average = data.slice(start, end + 1).reduce((sum, value) => sum + value, 0) / (end - start + 1);
        smoothed.push(average);
    }
    return smoothed;
};

// pitch analysis
const findPitchRange = (centroidData) => {
    const maxPitch = Math.max(...centroidData);
    const minPitch = Math.min(...centroidData);
    return { maxPitch, minPitch };
  };

// categorizes pitches based on spectral centroid
const categorizePitches = (centroidData) => {
  
 // do analysis to find thresholds
  const { maxPitch, minPitch } = findPitchRange(centroidData);
  const sectionSize = (maxPitch - minPitch) / 4;
  const lowThreshold = minPitch + sectionSize;
  const midThreshold = minPitch + 2 * sectionSize;
  const highThreshold = minPitch + 3 * sectionSize;

  return centroidData.map(centroid => {
    if (centroid < lowThreshold) {
      return 'A';
    } else if (centroid < midThreshold) {
      return 'B';
    } else if (centroid < highThreshold) {
      return 'C';
    } else {
      return 'D';
    }
  });
};

const createBeatmap = (onsets, chromaFeatures, audioBuffer) => {
    const pitchLevels = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
      };
    const beatmap = {};
  
    onsets.forEach((onset, index) => {
      if (onset) {
        const chromaSection = chromaFeatures.slice(index * 12, (index + 1) * 12);
  
        const maxChromaIndex = chromaSection.indexOf(Math.max(...chromaSection));
        const pitchLevel = Object.keys(pitchLevels)[maxChromaIndex];
  
        // calculates the time in milliseconds
        const startTime = (index * audioBuffer.duration * 1000) / onsets.length;
  
        beatmap[startTime] = pitchLevel;
      }
    });
  
    return beatmap;
  };
  
// analyzes audio and returns formatted data
const analyzeAudio = async (filePath) => {
  try {
    const bufferSize = 512;

    const audioPath = path.join(__dirname, filePath);
    const audioBuffer = await loadFile(audioPath);
    //console.log(audioBuffer);

    const features = Meyda.extract(['loudness', 'chroma'], audioBuffer.getChannelData(0).slice(0, bufferSize));
    //console.log(features);

    const noteOnsets = findNoteOnsets(features.loudness);
    console.log(noteOnsets);

    const beatmap = createBeatmap(noteOnsets, features.chroma, audioBuffer);
    console.log(beatmap);
    /*const pitchLevels = categorizePitches(features.spectralCentroid);
    console.log(pitchLevels);

    const formattedData = {};
    noteOnsets.forEach((onset, index) => {
      formattedData[Math.floor(onset * 512 / audioBuffer.sampleRate * 1000)] = pitchLevels[index];
    });*/

    
    return beatmap;
  } catch (error) {
    throw `Error: ${error.message}`;
  }
};

export default analyzeAudio;
