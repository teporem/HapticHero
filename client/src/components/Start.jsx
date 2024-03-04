import React, { useState, useEffect } from 'react';
import logo from '../mascot-v2.svg';

const Start = () => {

  return (
    <div>
        <h1>Haptic Hero</h1>
        <a href="#/home">Tap to Start</a>
        <img className="svg" src={logo} alt="Haptic Hero mascot" />
    </div>
  );
};

export default Start;
