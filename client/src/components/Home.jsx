import React, { useState, useEffect } from 'react';
import '../App.css';
import name from '../haptichero_font_2.png';
import Play from './Play';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const Home = ({bluetooth}) => {
  const [file, setFile] = useState({preview: '', data: ''});
	const [song, setSong] = useState(null);
	const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const handleStart = () => {
    setPlaying(true);
  };
  
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const previewURL = URL.createObjectURL(selectedFile);
    const reader = new FileReader();
  
    reader.onload = async () => {
      const audioContext = new AudioContext();
      const arrayBuffer = reader.result;
  
      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
  
        const file = {
          preview: previewURL,
          data: selectedFile,
          duration: duration
        };
  
        setFile(file);
      } catch (error) {
        console.error('Error decoding audio data:', error);
      }
    };
  
    reader.readAsArrayBuffer(selectedFile);
  };
  

  const handleSubmit = async (e) => {
    setError(false);
    setCanPlay(false);
    setLoading(true);
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', file.data);
    try {
      await axios.post('http://localhost:3001');
      const response = await axios.post('http://localhost:3001/upload', formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
      })
      if (response) {
          setError(false);
          let song = {duration: file.duration * 1000, beatmap: response.data, audio: file.preview };
          console.log(song)
          setSong(song);
          setCanPlay(true);
          setLoading(false);
      }
    } catch (e) {
      try {
        console.log(e);
        // if it's not up locally, check if the server is up
        await axios.get('https://server.haptichero.site'); // should return status: "Connected"
        const response = await axios.post('https://server.haptichero.site/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        })
        if (response) {
          setError(false);
          let song = {duration: 60 * 1000, beatmap: response.data, audio: file.preview };
          console.log(song)
          setSong(song);
          setCanPlay(true);
          setLoading(false);
        }
      } catch (e) {
        // if neither sites are up
        console.log(e)
        setError(true);
        setLoading(false);
        setCanPlay(false);
      }
    }    
};

	return (
		<div>
			{ playing ? 
			(
				<Play song={song} tutorial={false} bluetooth={bluetooth}/>
			) :
			(
				<div>
          <h1><img className="main_title_img_2" src={name} alt="Haptic Hero"/></h1>
          {error ? <p className='error'>Failed to upload song and generate beatmap.</p> : null}
          <div className="upload-sec">
          <form onSubmit={handleSubmit}>
            <label htmlFor='selected-song' >Selected Song: </label>
            <input type='file' name='file' id='audio-file' onChange={handleFileChange} required></input>
            <button type='submit'>Upload</button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-45px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </form>
          <button onClick={handleStart} disabled={!canPlay}>Start Game</button>
          <br/>
          </div>
          <a className="link-button" href="#/tutorial">Start Tutorial</a>
			  </div>
			)}
			</div>
		
	);
};

export default Home;