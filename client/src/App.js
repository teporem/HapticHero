import logo from './logo.svg';
import Gamepad from './components/Gamepad';
import Home from './components/Home';
import Play from './components/Play';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [song, setSong] = useState({duration: 20, beatmap: {0:"A", 5:"B", 10:"C", 12:"D", 15:"A"}});
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <h1>Gamepad API</h1>
        <Gamepad />
      </header>

        <div className="App-body">
          <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/play' element={<Play song={song}/>} />
          </Routes>
        </div>
      </div>
    </Router>
    
  );
}

export default App;
