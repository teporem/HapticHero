import React, { useState, useEffect } from 'react';

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serialData, setSerialData] = useState('');
  const [inputData, setInputData] = useState('');
  const [inputFile, setInputFile] = useState(null);

  // https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
  // An implementation of Nordic Semicondutor's UART/Serial Port Emulation over Bluetooth low energy
  const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

  // Allows the micro:bit to transmit a byte array
  const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

  // Allows a connected client to send a byte array
  const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  let rxCharacteristic;

  const connect = async () => {
    try {
      const options = {
        filters: [
          //{ services: [0x603ec4a9, 0x6837, 0x44a5, 0xb388, 0xa910269edd43] } 
          //{ services: [0xADAF0201, 0x4369, 0x7263, 0x7569, 0x74507974686E] } ,
          //{ services: ["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"]},
          { name: "CIRCUITPY015a" },
        ],
        optionalServices: [
//          "6e400001-b5a3-f393-­e0a9-­e50e24dcca9e",
//            '00001234-0000-1000-8000-00805f9b34fb'
            UART_SERVICE_UUID
        ]
      };
      const device = await navigator.bluetooth.requestDevice(options);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(UART_SERVICE_UUID);
      const txCharacteristic = await service.getCharacteristic(
        UART_TX_CHARACTERISTIC_UUID
      );
      txCharacteristic.startNotifications();
      txCharacteristic.addEventListener(
        "characteristicvaluechanged",
        onTxCharacteristicValueChanged
      );
      rxCharacteristic = await service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      );
      setDevice(device);
      setIsConnected(true);
      console.log('Connected to Bluetooth device');
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      setIsConnected(false);
    }
  };

  function onTxCharacteristicValueChanged(event) {
    let receivedData = [];
    for (var i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }
  
    const receivedString = String.fromCharCode.apply(null, receivedData);
    console.log(receivedString);
    if (receivedString === "S") {
      console.log("Shaken!");
    }
  }

  useEffect(() => {
    if (!device) return;

    const disconnect = () => {
      if (device.gatt.connected) {
        device.gatt.disconnect();
        setIsConnected(false);
        console.log('Disconnected from Bluetooth device');
      }
    };

    return () => {
      disconnect();
    };
  }, [device]);

  const sendAudioData = async () => {
    
  };

  const handleFileInputChange = (event) => {
    setInputFile(event.target.files[0]);
  };

  const sendData = async () => {
    if (!rxCharacteristic) {
      return;
    }
  
    try {
      let encoder = new TextEncoder();
      rxCharacteristic.writeValue(encoder.encode(inputData + "\n"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Bluetooth</h2>
      {isConnected ? (
        <div>Device Connected</div>
      ) : (
        <div>Device Not Connected</div>
      )}
      <button onClick={connect}>Connect</button>

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

export default Bluetooth;
