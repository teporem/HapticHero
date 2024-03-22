import express from 'express';
import * as data from '../data/index.js';
const settings = data.settings;

const router = express.Router();

// GET /settings
router
  .route('/')
    .get(async (req, res) => {
        return res.json({ settings: "settings" })

    });

export default router;