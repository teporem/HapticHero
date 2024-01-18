import express from 'express';
import * as data from '../data/index.js';
const songs = data.songs;

const router = express.Router();

// GET /songs
router
  .route('/')
    .get(async (req, res) => {
        return res.json({ song1: "song1" })

    });

router
    .route('/beatmap')
    .get(async (req, res) => {
      return;
      //return songs.generateBeatmap('../songs/sample_song.mp3');
    });

export default router;