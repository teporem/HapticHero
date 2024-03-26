//import validation from '../validation.js';
import analyzeAudio  from './beatmap.js';

export const uploadSong = () => {
  return {name: "song1", link: null, audio: "audio1"};
};

export const toggleFavorite = (song) => {
  return;
};

export const setSettings = (settings) => {
  return;
};

export const searchSong = async (keyword) => {
  return [{name: "song1", link: "link1", audio: "audio1"}, {name: "song2", link: "link2", audio: "audio2"}];
};

export const generateBeatmap = async (song) => {
  // song is filepath here for now
  return await analyzeAudio(song);
};


export const generateBeatmapAI = async (song) => {
  return {beats: [{"time1": "beat1"}, {"time2": "beat2"}]};
};

