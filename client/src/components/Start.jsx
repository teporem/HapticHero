import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';

const Start = () => {

  return (
    <div>
        <h1>Haptic Hero</h1>
        <a href="/home">Tap to Start</a>
        <img src={logo} alt="React Logo" />
    </div>
  );
};

export default Start;
