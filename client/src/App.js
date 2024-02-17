import logo from './logo.svg';
import Gamepad from './components/Gamepad';
//import SerialCommunication from './components/SerialCommunication';
import WebSerialAPI from './components/WebSerialAPI';
import Bluetooth from './components/Bluetooth';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gamepad API</h1>
        <Gamepad />
      </header>
      <Bluetooth/>
    </div>
  );
}

export default App;
