// connects to serialport via server - for testing purposes only 
import express from 'express';
import { connectToSerialPort, disconnectFromSerialPort, writeDataToSerial } from '../data/serial.js';

const router = express.Router();

// POST /serial/connect
router
  .route('/connect')
    .post(async (req, res) => {
      connectToSerialPort(); 
      return res.json({ success: "connected" });
    });

// POST /serial/disconnect
router
  .route('/disconnect').post(async (req, res) => {
    disconnectFromSerialPort(); 
    return res.json({ success: "disconnected" });
  });

// POST /serial/write
router
  .route('/write')
    .post(async (req, res) => {      
      if (req.body) {
        writeDataToSerial(req.body.message); 
        return res.json({ success: "data written" });
      } else {
        return res.status(400).json({ error: "Invalid request." });
      }
    });

export default router;