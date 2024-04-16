import express from 'express';
import multer from 'multer';
import path from 'path'
import xss from 'xss';
import * as data from '../data/index.js';
const songs = data.songs;
const router = express.Router();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/vnd.wav'  || file.mimetype === 'audio/wav'  || file.mimetype === 'audio/wave'  || file.mimetype === 'audio/x-wav') {
    cb(null, true);
  } else {
    console.log('Unsupported file type:', file.mimetype);
    cb(new Error('File type not supported. Only WAV and MP3 are allowed.'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    file.originalname=xss(file.originalname);
    cb(null, file.originalname)
  },
});

const upload = multer({ storage: storage, fileFilter });

// POST /upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const beatmap = await songs.generateBeatmap('../uploads/'+req.file.originalname);
    return res.json(beatmap);
  } catch(e) {
    res.json(e);
  }
});

export default router;