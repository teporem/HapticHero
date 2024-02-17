import React, { useState, useEffect } from 'react';
import Play from './Play';
import axios from 'axios';

const Tutorial = () => {
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchBeatmapData = async () => {
      try {
        // replace with an actual song for tutorial
        const response = await axios.get('http://localhost:3001/songs/beatmap');
        setSong({duration: 10 * 1000, beatmap: response.data });
      } catch (error) {
        console.error('Error fetching beatmap data:', error);
      }
    };

    fetchBeatmapData();
    
  }, []);

  return (
    <div>
        <h1>Tutorial mode</h1>
        <p>When you feel the vibration, press the corresponding button!</p>
        {song ? (
          <Play song={song}/>
        ): (
          <p>loading</p>
        )
        }
        
    </div>
  );
};

export default Tutorial;
