import React, { useState, useEffect } from 'react';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let gameInterval;
let acceptableTimes = [];
let acceptableNotes = [];

const Play = ({ song, tutorial, bluetooth }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [currentNote, setCurrentNote] = useState({ time: 0, note: song.beatmap[0], played: false });
  const [score, setScore] = useState(0);
  const [audio] = useState(new Audio(song.audio));
  //const [receivedData, setReceivedData] = useState("");
  const [recentButton, setRecentButton] = useState(null);
  const [gameOngoing, setGameOngoing] = useState(false);
  //const [swipe, setSwipe] = useState("");
  const [playable, setPlayable] = useState(true);

  const delay = 500; // vibrations are sent .5s earlier than expected in song/play
  const acceptable_range = 500; // notes within .5s of expected time are accepted
  let c_time = -3000;
  let c_note = {time: 0, note: song.beatmap[0], played: false}

  var xDown = null;                                                        
  var yDown = null; 

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
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener("keydown", handleKeyPress);
    if (bluetooth && bluetooth.tx) {
      //bluetooth.tx.startNotifications();
      bluetooth.tx.addEventListener(
        "characteristicvaluechanged",
        onTxCharacteristicValueChanged
      );
    }
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);        
      document.removeEventListener('touchmove', handleTouchMove, false);
      document.removeEventListener("keydown", handleKeyPress);
      if (bluetooth && bluetooth.tx) {
        bluetooth.tx.removeEventListener("characteristicvaluechanged", onTxCharacteristicValueChanged);
      }
    }
    
  });

  function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
  };                                                

  function handleTouchMove(evt) {
      if ( !xDown || !yDown ) {
        return;
      }
      var xUp = evt.touches[0].clientX;                                    
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
          if ( xDiff > 0 ) {
              console.log("swiped left");
              //setSwipe("left");
              if (recentButton) {
                handleButtonInput(recentButton);
                //setRecentButton(null);
              }
          } else {
              console.log("swiped right");
              //setSwipe("right");
              if (recentButton) {
                handleButtonInput(recentButton);
                //setRecentButton(null);
              }
          }                       
      } else {
          if ( yDiff > 0 ) {
              //console.log("swiped up");
              //setSwipe("up");
          } else { 
              //console.log("Swiped down");
              //setSwipe("down");
          }                                                                 
      }
      xDown = null;
      yDown = null;                                             
  };

  function onTxCharacteristicValueChanged(event) {
    console.log("TX characterestic change detected");
    let data = event.target.value.getUint8(0);
    //setReceivedData(data);
    setRecentButton(data);
    //handleButtonInput(data);
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
    setPlayable(false);
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
        setGameOngoing(true);
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
          const e_time = parseInt(time) + delay
          c_note = { time: e_time.toString(), note: note, played: false };
          sendVibration(note);
          setCurrentNote(c_note);
          try {
            acceptableTimes.push(e_time);
            acceptableNotes.push(note);
          } catch(e) {
            console.log(e);
            console.log(acceptableTimes);
            console.log(acceptableNotes);
          }
          const withinRange = acceptableTimes.findIndex(time => Math.abs(c_time - time) <= acceptable_range);
          if (withinRange >= 0) {
            acceptableTimes = acceptableTimes.slice(withinRange);
            acceptableNotes = acceptableNotes.slice(withinRange);
          }
          console.log(c_time);
          console.log("Acceptables: ");
          console.log(acceptableTimes);
          console.log(acceptableNotes);
          currentNoteIndex++;
        }
      }
    }, 100);

    const clearTimer = () => clearInterval(gameInterval);

    setTimeout(() => {
      stopAudio();
      clearTimer();
      setGameOngoing(false);
      setPlayable(true);
      acceptableTimes = []; 
      acceptableNotes = [];
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
  };

  const handleHit = () => {
    console.log('Note played accurately!');
    setScore(prev => (prev + 100 + (100 * stats.currentStreak)));
    setStats(prevStats => ({
      ...prevStats,
      hit: prevStats.hit + 1,
      currentStreak: prevStats.currentStreak + 1,
      longestStreak:
        prevStats.currentStreak+1 > prevStats.longestStreak
        ? prevStats.currentStreak+1 : prevStats.longestStreak
    }));
    setCurrentNote(prevNote => ({ ...prevNote, played: true }));
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        setRecentButton(1);
        console.log(recentButton);
        break;
      case 'ArrowDown':
        setRecentButton(2);
        console.log(recentButton);
        break;
      case 'ArrowLeft':
        setRecentButton(3);
        console.log(recentButton);
        break;
      case 'ArrowRight':
        setRecentButton(4);
        console.log(recentButton);
        break;
      default:
        // Ignore other key presses
        break;
    }
  };

  const handleButtonInput = (btn) => {
    if (gameOngoing) {
      let i;
      switch (btn) {
        case 1:
          console.log("First note detected.");
          console.log(acceptableNotes);
          i = acceptableNotes.indexOf('A');
          if (i >= 0) {
            console.log("Accurate hit!");
            handleHit();
            acceptableTimes = [...acceptableTimes.slice(0, i), ...acceptableTimes.slice(i + 1)];
            acceptableNotes = [...acceptableNotes.slice(0, i), ...acceptableNotes.slice(i + 1)];
          } else {
            console.log(`Missed note!`);
            handleMiss();
          }
          break;
        case 2:
          console.log("Second note detected.");
          console.log(acceptableNotes);
          i = acceptableNotes.indexOf('B');
          if (i >= 0) {
            console.log("Accurate hit!");
            handleHit();
            acceptableTimes = [...acceptableTimes.slice(0, i), ...acceptableTimes.slice(i + 1)];
            acceptableNotes = [...acceptableNotes.slice(0, i), ...acceptableNotes.slice(i + 1)];
          } else {
            console.log(`Missed note!`);
            handleMiss();
          }
          break;
        case 3:
          console.log("Third note detected.");
          console.log(acceptableNotes);
          i = acceptableNotes.indexOf('C');
          if (i >= 0) {
            console.log("Accurate hit!");
            handleHit();
            acceptableTimes = [...acceptableTimes.slice(0, i), ...acceptableTimes.slice(i + 1)];
            acceptableNotes = [...acceptableNotes.slice(0, i), ...acceptableNotes.slice(i + 1)];
          } else {
            console.log(`Missed note!`);
            handleMiss();
          }
          break;
        case 4:
          console.log("Fourth note detected.");
          console.log(acceptableNotes);
          i = acceptableNotes.indexOf('D');
          if (i >= 0) {
            console.log("Accurate hit!");
            handleHit();
            acceptableTimes = [...acceptableTimes.slice(0, i), ...acceptableTimes.slice(i + 1)];
            acceptableNotes = [...acceptableNotes.slice(0, i), ...acceptableNotes.slice(i + 1)];
          } else {
            console.log(`Missed note!`);
            handleMiss();
          }
          break;
        default:
          console.log(`Missed note! No valid note detected.`);
          handleMiss();
          break;
      }
      console.log(`Score is: ${score}`);
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

      { playable ? (
        <button onClick={handlePlayButtonClick}>Play</button>
      )
      : (null)}
      
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
            <p>Score: {score}</p>
            </div>
            )
          : (<div>  
              <p>Hits: {stats.hit}; Misses: {stats.miss}; Longest Combo: {stats.longestStreak}</p>
              <p>Score: {score}</p>
            </div>)
          }
        </div>
      )
        
        
      }
    </div>
  );
};

export default Play;
