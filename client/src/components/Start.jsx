import React, { useState, useEffect } from 'react';
import logo from '../mascot-v2.svg';
import name from '../haptichero_font_2.png';

const Start = () => {

  return (
    <div>
        <h1><img className="main_title_img" src={name} alt="Haptic Hero"/></h1>
        <a href="#/home">Tap to Start</a>
        <img className="svg" src={logo} alt="Haptic Hero mascot" />
    </div>
  );
};

export default Start;
