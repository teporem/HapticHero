import React, { useState } from 'react';
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

  const handleStart = () => {
    setPlaying(true);
  };
  const handleFileChange = (e) => {
    const file = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
    }
    setFile(file);
  }

  const handleSubmit = async (e) => {
    setError(false);
    setCanPlay(false);
    setLoading(true);
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', file.data);
    try {
      await axios.get('http://ec2-18-118-227-233.us-east-2.compute.amazonaws.com:3001'); 
    } catch (e) {
      try {
        console.log(e);
        if (e.response.status === 404) {
          // homepage should return "not found"
          const response = await axios.post('http://ec2-18-118-227-233.us-east-2.compute.amazonaws.com:3001/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            })
            if (response) {
                setError(false);
                let song = {duration: 10 * 1000, beatmap: response.data };
                console.log(song)
                setSong(song);
                setCanPlay(true);
                setLoading(false);
            }
        } else {
          // if the server isn't up, check locally
          const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
          })
          if (response) {
              setError(false);
              let song = {duration: 10 * 1000, beatmap: response.data };
              console.log(song)
              setSong(song);
              setCanPlay(true);
              setLoading(false);
          }
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