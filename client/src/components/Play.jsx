import React, { useState, useEffect, useRef } from 'react';
import demo_audio from '../demo/purple_demo2.wav';
let gameInterval;

const Play = ({ song, tutorial }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [currentNote, setCurrentNote] = useState({ time: 0, note: song.beatmap[0], played: false });
  const [score, setScore] = useState(0);
  const [audio] = useState(tutorial ? new Audio(demo_audio) : null);

  let c_time = 0;
  let c_note = {time: 0, note: song.beatmap[0], played: false}

  const [stats, setStats] = useState({
    hit: 0,
    miss: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakBroken: false
  });

  const startGame = () => {
    setCurrentTime(0);

    setScore(0);
    setStats({hit:0, miss:0, currentStreak:0, longestStreak:0});

    document.addEventListener('keyup', handleKeyPress);

    if (gameInterval) {
      clearInterval(gameInterval);
    }
    // play audio
    // const audio = new Audio(song.audio);
    // audio.play();
    playAudio();

    const beatmapEntries = Object.entries(song.beatmap);
    //console.log(beatmapEntries);
    let currentNoteIndex = 0;

    gameInterval = setInterval(() => {
      setCurrentTime((prev) => prev + 100);
      c_time = c_time + 100;
      if (currentNoteIndex < beatmapEntries.length) {
        const [time, note] = beatmapEntries[currentNoteIndex];
        //console.log(`Expected Note at ${time}: ${note}`);
        //every 100ms, check if there's a new upcoming note to expect
        if (parseInt(time) <= c_time) {
          c_note = { time: time, note: note, played: false };
          setCurrentNote(c_note);
          currentNoteIndex++;
        }
      }
    }, 100);

    const clearTimer = () => clearInterval(gameInterval);

    setTimeout(() => {
      clearTimer();
    }, song.duration);

    return;
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  const handleMiss = () => {
    //setScore((prev) => prev - 1);
    setStats(prevStats => ({
      ...prevStats,
      miss: prevStats.miss + 1,
      currentStreak: 0,
    }));
  };

  const handleHit = () => {
    console.log('Note played accurately!');
    //setScore((prev) => prev + 1);
    setStats(prevStats => ({
      ...prevStats,
      hit: prevStats.hit + 1,
      currentStreak: prevStats.currentStreak + 1,
      longestStreak:
        prevStats.currentStreak+1 > prevStats.longestStreak
        ? prevStats.currentStreak : prevStats.longestStreak
    }));
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if ('A' === c_note.note && Math.abs(c_time - c_note.time) <= 1000) {
          c_note.played ? handleMiss() : handleHit();
          c_note.played = true;
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not A`);
          handleMiss();
        }
        break;
      case 'ArrowDown':
        if ('B' === c_note.note && Math.abs(c_time - c_note.time) <= 1000) {
          c_note.played ? handleMiss() : handleHit();
          c_note.played = true;
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not B`);
          handleMiss();
        }
        break;
      case 'ArrowLeft':
        if ('C' === c_note.note && Math.abs(c_time - c_note.time) <= 1000) {
          c_note.played ? handleMiss() : handleHit();
          c_note.played = true;
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not C`);
          handleMiss();
        }
        break;
      case 'ArrowRight':
        if ('D' === c_note.note && Math.abs(c_time - c_note.time) <= 1000) {
          c_note.played ? handleMiss() : handleHit();
          c_note.played = true;
        } else {
          console.log(`Missed note! ${c_time} doesn't match ${c_note.time} or ${c_note.note} not D`);
          handleMiss();
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
    <div className="Play">
      { tutorial ? (       
        <div><h1>Tutorial mode</h1>
        <p>When you feel the vibration, press the corresponding button!</p></div>)
      : (<div></div>)
      }

      <button onClick={handlePlayButtonClick}>Play</button>
      {countdown > 0 ? (
        <div>
          <p>{countdown}</p>
        </div>
      ) : (
        <div>  
          <p>Game is now playing!</p>
          <p>Current Time: {currentTime}ms</p>
          <p>Current Note: {currentNote.note}</p>
          <p>Hits: {stats.hit}; Misses: {stats.miss}; Longest Combo: {stats.longestStreak}</p>
        </div>
      )}
    </div>
  );
};

export default Play;
