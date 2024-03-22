import React, { useState, useEffect } from 'react';
import Play from './Play';
import beatmap from '../demo/purple_demo_beatmap2.json';

const Tutorial = ({bluetooth}) => {
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchBeatmapData = async () => {
      try {
        // replace with an actual song for tutorial
        //const response = await axios.get('http://localhost:3001/songs/beatmap');
        //setSong({duration: 10 * 1000, beatmap: response.data });
        console.log(beatmap)
        setSong({duration: 18 * 1000, beatmap: beatmap});
      } catch (error) {
        console.error('Error fetching beatmap data:', error);
      }
    };

    fetchBeatmapData();
    
  }, []);

  return (
    <div>

        {song ? (
          <Play song={song} tutorial={true} bluetooth={bluetooth}/>
        ): (
          <p>loading</p>
        )
        }
        
    </div>
  );
};

export default Tutorial;
