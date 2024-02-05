import logo from './logo.svg';
import Home from './components/Home';
import Start from './components/Start';
import Play from './components/Play';
import Tutorial from './components/Tutorial.jsx';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [song, setSong] = useState({duration: 20 * 1000, beatmap: {0:"A", 5000:"B", 10000:"C", 12000:"D", 15000:"A"}});
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' element={<Start />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/play' element={<Play song={song}/>} />
          <Route path='/tutorial' element={<Tutorial />}></Route>
        </Routes>
      </header>
      </div>
    </Router>
    
  );
}

export default App;
