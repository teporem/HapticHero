import React, { useState, useEffect } from 'react';
let gameInterval;

const Play = ({ song }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [currentNote, setCurrentNote] = useState({ time: 0, note: song.beatmap[0] });
  const [score, setScore] = useState(0);
  let c_time = 0;
  let c_note = {time: 0, note: song.beatmap[0]}

  const startGame = () => {
    setCurrentTime(0);
    
    document.addEventListener('keyup', handleKeyPress);

    if (gameInterval) {
      clearInterval(gameInterval);
    }
    // play audio
    // const audio = new Audio(song.audio);
    // audio.play();

    const beatmapEntries = Object.entries(song.beatmap);
    //console.log(beatmapEntries);
    let currentNoteIndex = 0;

    gameInterval = setInterval(() => {
      setCurrentTime((prev) => prev + 1);
      c_time = c_time + 1;
      if (currentNoteIndex < beatmapEntries.length) {
        const [time, note] = beatmapEntries[currentNoteIndex];
        //console.log(`Expected Note at ${time}: ${note}`);
        if (parseInt(time) <= c_time) {
          setCurrentNote({ time: time, note: note });
          c_note = { time: time, note: note };
          currentNoteIndex++;
        }
      }
    }, 1000);

    const clearTimer = () => clearInterval(gameInterval);

    setTimeout(() => {
      clearTimer();
    }, song.duration * 1000);

    return clearTimer;
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if ('A' === c_note.note && Math.abs(c_time - c_note.time) <= 1) {
          console.log('Note played accurately!');
          setScore((prev) => prev + 10);
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not A`);
        }
        break;
      case 'ArrowDown':
        if ('B' === c_note.note && Math.abs(c_time - c_note.time) <= 1) {
          console.log('Note played accurately!');
          setScore((prev) => prev + 10);
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not B`);
        }
        break;
      case 'ArrowLeft':
        if ('C' === c_note.note && Math.abs(c_time - c_note.time) <= 1) {
          console.log('Note played accurately!');
          setScore((prev) => prev + 10);
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not C`);
        }
        break;
      case 'ArrowRight':
        if ('D' === c_note.note && Math.abs(c_time - c_note.time) <= 1) {
          console.log('Note played accurately!');
          setScore((prev) => prev + 10);
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not D`);
        }
        break;
      default:
        // Ignore other key presses
        break;
    }
  };

  const handlePlayButtonClick = () => {
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      startGame();
    }, 3000);
  };

  return (
    <div>
      <button onClick={handlePlayButtonClick}>Play</button>
      {countdown > 0 ? (
        <div>
          <div>{countdown}</div>
        </div>
      ) : (
        <div>
          <p>Game is now playing!</p>
          <p>Current Time: {currentTime} </p>
          <p>Current Note {currentNote.note}</p>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default Play;
