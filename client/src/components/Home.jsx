import React from 'react';
import '../App.css';
/*
Will have: 
- settings icon
- select song / current song
- bluetooth connect option / start game option
- bluetooth connection status
*/
const Home = () => {
	let demo = true;

	return (
		<div >
			<h1>Haptic Hero</h1>
		  { demo ? (
        <a href="/tutorial">Start Tutorial</a>
      ) : (
        <a href="/play">Start Game</a>
      )}
		</div>
	);
};

export default Home;