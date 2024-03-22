import express from 'express';

const router = express.Router();

// POST /upload
router
  .route('/')
    .post(async (req, res) => {
        return res.json({ sucess: "uploaded" })

    });

export default router;