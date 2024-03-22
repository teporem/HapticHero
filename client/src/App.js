import Home from './components/Home';
import Start from './components/Start';
import Play from './components/Play';
import Tutorial from './components/Tutorial.jsx';
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import Bluetooth from './components/Bluetooth';
import BluetoothIcon from './components/BluetoothIcon';

import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [song, setSong] = useState({duration: 20 * 1000, beatmap: {0:"A", 5000:"B", 10000:"C", 12000:"D", 15000:"A"}});
  const [bluetoothConnection, setBluetoothConnection] = useState(null);
  const handleBluetoothConnect = (connection) => {
    setBluetoothConnection(connection);
  };
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' element={<Start />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/play' element={<Play song={song} tutorial={false} bluetooth={bluetoothConnection}/>} />
          <Route path='/tutorial' element={<Tutorial bluetooth={bluetoothConnection} />}></Route>
          <Route path='/bluetooth' element={<Bluetooth />}></Route>
        </Routes>
        <BluetoothIcon onConnect={handleBluetoothConnect}/>
      </header>
    </div>
    </Router>
    
  );
}

export default App;
