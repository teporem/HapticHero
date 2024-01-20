// connects to serialport via Web Serial API - not really compatible with mobile devices
import React, { useState } from 'react';

const WebSerialAPI = () => {
  const [serialData, setSerialData] = useState('');
  const [inputData, setInputData] = useState('');
  const [port, setPort] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  //const picoVendorId = '239A';
  //const picoProductId = '80F4';

  const connect = async () => {

    try {
      if (port && port.readable) {
        await port.readable.cancel();
      }
      if (port && port.writable) {
        await port.writable.getWriter().close();
      }
      await port.close();
      console.log("Closed existing port.")
    } catch (error) {
      console.error('Error closing existing port:', error);
    }

    try {
      const filter = { usbVendorId: 0x239A };
      const port = await navigator.serial.requestPort({filters: [filter]});
      setPort(port);
      await port.open({ baudRate: 9600 });
      setIsConnected(true);
      console.log("Connected to port.");

      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const stringValue = String.fromCharCode.apply(null, value);
        setSerialData(stringValue);
      }
    } catch (e) {
      console.log("Failed to connect to port.");
      if (!port || !(port && port.readable) || !(port && port.writable)) {
          setIsConnected(false);
      }
    }
  };

  const sendData = async () => {
    try {
      if (port) {
        const encoder = new TextEncoder();
        const writer = port.writable.getWriter();
        await writer.write(encoder.encode(inputData));
        writer.releaseLock();
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
          <div>Device Connected</div>
      ) : (
          <div>Device Not Connected</div>
      )}
      <button onClick={connect}>Connect</button>
      <textarea value={serialData} cols="40" rows="10" readOnly></textarea>
      <br />
      <input
        type="text"
        value={inputData}
        placeholder="Enter data to send"
        onChange={(e) => setInputData(e.target.value)}
      />
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default WebSerialAPI;
