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

export default router;