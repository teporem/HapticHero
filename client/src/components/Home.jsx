import React, { useState } from 'react';
import '../App.css';
import name from '../haptichero_font_2.png';
import Play from './Play';
import axios from 'axios';
/*
Will have: 
- settings icon
- select song / current song
- bluetooth connect option / start game option
- bluetooth connection status
*/
const Home = ({bluetooth}) => {
  const [file, setFile] = useState({preview: '', data: ''});
	const [song, setSong] = useState(null);
	const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

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
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', file.data);
    try {
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
        }
    } catch (e) {
        setError(true);
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
          {error ? <p className='error'>Invalid file.</p> : null}
          <form onSubmit={handleSubmit}>
            <label htmlFor='selected-song' >Selected Song: </label>
            <input type='file' name='file' id='audio-file' onChange={handleFileChange} required></input>
            <button type='submit'>Submit</button>
          </form>
          <button onClick={handleStart} disabled={!canPlay}>Start Game</button>
          <br/>
          <a href="#/tutorial">Start Tutorial</a>
			  </div>
			)}
			</div>
		
	);
};

export default Home;