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
      try {
        const beatmap = songs.generateBeatmap('../songs/purple_demo2.wav');
        return res.json(beatmap);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });

export default router;