# HAPTIC HERO: AN ACCESSIBLE GAMING EXPERIENCE

## About this Project
Haptic Hero is a music & rhythm-based video game created to be accessible to students who are visually impaired. The design takes inspiration from the existing game, Guitar Hero, and flips it with an accessible spin. Instead of prioritizing visual cues for gameplay, the game is focused on tactile cues (haptics) and audio cues, making it universally accessible for everyone, regardless of their visual abilities. More about the project here: https://sites.google.com/stevens.edu/haptichero

## Code in this Repo
- Raspberry Pi Pico code:
  - To install, upload the file to a Raspberry Pi Pico with CircuitPython and all the necessary hardware components. 
- React client application:
  - Currently available [here](https://www.haptichero.site) using Github Pages.
  - To run locally: run the commands `npm i` and `npm start` from the client folder.
- Node.js backend server:
  - Minimally availble [here](https://server.haptichero.site) using AWS EC2.
  - To run locally and access the full features, install ffmpeg and run the commands `npm i` and `npm start` from the server folder.
  - If a locally hosted server is detected, the client will default to using that. 
 
  
