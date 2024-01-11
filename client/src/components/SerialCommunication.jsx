import React, { useState } from 'react';
import axios from 'axios';

const SerialCommunication = () => {
  const [response, setResponse] = useState('');
  const [dataToSend, setDataToSend] = useState('');

  const handleSerialConnect = async () => {
    try {
      const response = await axios.post('http://localhost:3001/serial/connect', {});
      setResponse(response.data.message);
    } catch (error) {
      console.error('Error connecting to serial port:', error.message);
    }
  };

  const handleSerialDisconnect = async () => {
    try {
      const response = await axios.post('http://localhost:3001/serial/disconnect', {});
      setResponse(response.data.success);
    } catch (error) {
      console.error('Error disconnecting from serial port:', error.message);
    }
  };

  const handleWriteData = async () => {
    try {
      console.log(dataToSend);
      const response = await axios.post('http://localhost:3001/serial/write', {
        message: dataToSend,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResponse(response.data.success);
    } catch (error) {
      console.error('Error writing data to serial port:', error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSerialConnect}>Connect to Serial Port</button>
      <button onClick={handleSerialDisconnect}>Disconnect from Serial Port</button>

      <div>
        <input
          type="text"
          value={dataToSend}
          onChange={(e) => setDataToSend(e.target.value)}
          placeholder="Enter data to send"
        />
        <button onClick={handleWriteData}>Write Data to Serial Port</button>
      </div>

      <div>
        {response && <p>{response}</p>}
      </div>
    </div>
  );
};

export default SerialCommunication;
