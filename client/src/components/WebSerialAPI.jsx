// connects to serialport via Web Serial API - not really compatible with mobile devices
import React, { useState } from 'react';
import {WaveFile} from 'wavefile';

const WebSerialAPI = () => {
  const [serialData, setSerialData] = useState('');
  const [inputData, setInputData] = useState('');
  const [port, setPort] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputFile, setInputFile] = useState(null);

  //const picoVendorId = '239A';
  //const picoProductId = '80F4';
  console.log("Test");

  const connect = async () => {

    try {
      if (port && port.readable) {
        await port.readable.cancel();
      }
      if (port && port.writable) {
        await port.writable.getWriter().close();
      }
      if (port) {
        await port.close();
      }
      console.log("Closed existing port.")
    } catch (error) {
      console.error('Error closing existing port:', error);
    }

    try {
      const filter = { usbVendorId: 0x239A };
      const port = await navigator.serial.requestPort({filters: [filter]});
      setPort(port);
      await port.open({ baudRate: 115200 });
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

  const sendAudioData = async () => {
    if (!port || !inputFile) return;
  
    try {
      /*const fileBuffer = await inputFile.arrayBuffer();
      const audioContext = new AudioContext();
      
      const data = new Uint8Array(fileBuffer);

      const writer = port.writable.getWriter();
      await writer.write(data);
      await writer.releaseLock();*/

      /*const CHUNK_SIZE = 1024; // Adjust chunk size as needed
      const reader = new FileReader();
      //const fileBuffer = await inputFile.arrayBuffer();
      reader.onload = async (event) => {
          const buffer = event.target.result;
          for (let i = 0; i < buffer.byteLength; i += CHUNK_SIZE) {
              const chunk = buffer.slice(i, i + CHUNK_SIZE);
              const writer = port.writable.getWriter();
              await writer.write(chunk);
              await writer.releaseLock();
          }
      };
      reader.readAsArrayBuffer(inputFile);*/

      const CHUNK_SIZE = 1024; // Adjust chunk size as needed

      const fileSize = inputFile.size;
      let offset = 0;

      while (offset < fileSize) {
          const chunk = inputFile.slice(offset, offset + CHUNK_SIZE);
          const chunkData = await chunk.arrayBuffer();
          const writer = port.writable.getWriter();
          await writer.write(chunkData);
          await writer.releaseLock();
          offset += CHUNK_SIZE;
          console.log("a chunk sent")
      }

      // Signal the end of data transmission (assuming newline character)
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode('\n'));
      await writer.releaseLock();
      
      console.log('Audio data sent?');
    } catch (error) {
      console.error('Error sending audio data:', error);
    }
  };

  const handleFileInputChange = (event) => {
    setInputFile(event.target.files[0]);
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
      <h2>Web Serial API</h2>
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
      <br />
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={sendAudioData}>Send Audio Data</button>
    </div>
  );
};

export default WebSerialAPI;
