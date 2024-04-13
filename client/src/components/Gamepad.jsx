// not using Gamepad
import React, { useState, useEffect } from 'react';

const Gamepad = () => {
  const [isConnected, setConnected] = useState(false);
  useEffect(() => {

    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad);
      setConnected(true);
    };

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad);
      setConnected(false);
    };
/*
    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();

      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          // Example: Log button presses
          for (let j = 0; j < gamepad.buttons.length; j++) {
            if (gamepad.buttons[j].pressed) {
              console.log(`Button ${j} pressed`);
            }
          }

        }
      }
      requestAnimationFrame(updateGamepadState);
    };*/

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    //updateGamepadState();

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []); 

  return <div>Gamepad connection status: {String(isConnected)}</div>;
};

export default Gamepad;
