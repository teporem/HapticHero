import React, { useState, useEffect } from 'react';
import demo_audio from '../demo/purple_demo2.wav';
let gameInterval;

const Play = ({ song, tutorial, bluetooth }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [currentNote, setCurrentNote] = useState({ time: 0, note: song.beatmap[0], played: false });
  const [score, setScore] = useState(0);
  const [audio] = useState(tutorial ? new Audio(demo_audio) : null);
  const [receivedData, setReceivedData] = useState("");

  const delay = 500; 

  let c_time = -3000;
  let c_note = {time: 0, note: song.beatmap[0], played: false}

  const [stats, setStats] = useState({
    hit: 0,
    miss: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakBroken: false
  });

  const sendVibration = async (input) => {
    console.log("Sending: ", input);
    if (!bluetooth || !bluetooth.rx) {
      console.log("No rxCharacterestic found.");
      return;
    }
  
    try {
      let encoder = new TextEncoder();
      await bluetooth.rx.writeValueWithoutResponse(encoder.encode(input + "\n"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    if (bluetooth && bluetooth.tx) {
      //bluetooth.tx.startNotifications();
      bluetooth.tx.addEventListener(
        "characteristicvaluechanged",
        onTxCharacteristicValueChanged
      );
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      if (bluetooth && bluetooth.tx) {
        bluetooth.tx.removeEventListener("characteristicvaluechanged", onTxCharacteristicValueChanged);
      }
    }
    
  });

  function onTxCharacteristicValueChanged(event) {
    console.log("TX characterestic change detected");
    let data = event.target.value.getUint8(0);
    setReceivedData(data);
    handleButtonInput(data);
    console.log(data);
  }

  const startGame = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } 
    } catch(e) {
      console.log("No fullscreen capability on this device.");
    }
    
    setCurrentTime(-3000);

    setScore(0);
    setStats({hit:0, miss:0, currentStreak:0, longestStreak:0});

    if (gameInterval) {
      clearInterval(gameInterval);
    }
    const beatmapEntries = Object.entries(song.beatmap).map(([index, value]) => {
      const newIndex = parseInt(index) - delay;
      return [newIndex.toString(), value];
    });
    console.log(beatmapEntries);
    let currentNoteIndex = 0;

    gameInterval = setInterval(() => {
      if (c_time === -2000 || c_time === -1000 || c_time === 0) {
        setCountdown((prev) => prev - 1);
      }
      if (c_time === 0) {
        playAudio();
      }
      setCurrentTime((prev) => prev + 100);
      c_time = c_time + 100;
      if (currentNoteIndex < beatmapEntries.length) {
        const [time, note] = beatmapEntries[currentNoteIndex];
        //console.log(`Expected Note at ${time}: ${note}`);
        //every 100ms, check if there's a new upcoming note to expect
        //if (parseInt(time) <= c_time+500) {
        //  sendVibration(note);
        //}
        if (parseInt(time) <= c_time) {
          //handleMiss();
          c_note = { time: (parseInt(time) + delay).toString(), note: note, played: false };
          sendVibration(note);
          setCurrentNote(c_note);
          currentNoteIndex++;
        }
      }
    }, 100);

    const clearTimer = () => clearInterval(gameInterval);

    setTimeout(() => {
      clearTimer();
      if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    }, song.duration + 3000);

    

    return;
  };

  const stopAudio = () => {
    if (audio && !audio.paused) {
      audio.pause(); 
      audio.currentTime = 0; 
    }
  }

  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  const handleMiss = () => {
    if (!currentNote.played) {
      //setScore((prev) => prev - 1);
      setStats(prevStats => ({
        ...prevStats,
        miss: prevStats.miss + 1,
        currentStreak: 0,
      }));
    }
    console.log(`Score is: ${score + stats.longestStreak}`);
  };

  const handleHit = () => {
    console.log('Note played accurately!');
    setScore((prev) => prev + 1);
    setStats(prevStats => ({
      ...prevStats,
      hit: prevStats.hit + 1,
      currentStreak: prevStats.currentStreak + 1,
      longestStreak:
        prevStats.currentStreak+1 > prevStats.longestStreak
        ? prevStats.currentStreak+1 : prevStats.longestStreak
    }));
    console.log(`Score is: ${score + stats.longestStreak}`);
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if ('A' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not A`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 'ArrowDown':
        if ('B' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not B`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 'ArrowLeft':
        if ('C' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not C`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 'ArrowRight':
        if ('D' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not D`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      default:
        // Ignore other key presses
        break;
    }
  };

  const handleButtonInput = (btn) => {
    switch (btn) {
      case 1:
        if ('A' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not A`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 2:
        if ('B' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not B`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 3:
        if ('C' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not C`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      case 4:
        if ('D' === currentNote.note && Math.abs(currentTime - currentNote.time) <= 1000) {
          currentNote.played ? handleMiss() : handleHit();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        } else {
          console.log(`Missed note! ${currentTime} doesn't match ${currentNote.time} or ${currentNote.note} not D`);
          handleMiss();
          setCurrentNote(prevNote => ({ ...prevNote, played: true }));
        }
        break;
      default:
        // Ignore other key presses
        break;
    }
  };

  const handlePlayButtonClick = () => {
    setCountdown(3);
    stopAudio();
    startGame();
  };

  return (
    <div className="Play">
      { tutorial ? (       
        <div><h1>Tutorial mode</h1>
        </div>
        )
      : (<div></div>)
      }

      <button onClick={handlePlayButtonClick}>Play</button>
      {countdown > 0 ? (
        <div>
          <p>{countdown}</p>
        </div>
      ) : (
        <div>
          { tutorial ? (       
            <div>
            <p>Current Time: {currentTime}ms</p>
            <p>Incoming Note: {currentNote.note}</p>
            <p>Hits: {stats.hit}; Misses: {stats.miss}; Longest Combo: {stats.longestStreak}</p>
            <p>Score: {score + stats.longestStreak}</p>
            </div>
            )
          : (<div>  
              <p>Hits: {stats.hit}; Misses: {stats.miss}; Longest Combo: {stats.longestStreak}</p>
              <p>Score: {score + stats.longestStreak}</p>
            </div>)
          }
        </div>
      )
        
        
      }
    </div>
  );
};

export default Play;
