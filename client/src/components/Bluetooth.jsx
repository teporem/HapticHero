import React, { useState, useEffect } from 'react';

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      const options = {
        filters: [
          //{ services: [0x603ec4a9, 0x6837, 0x44a5, 0xb388, 0xa910269edd43] } 
          //{ services: [0xADAF0201, 0x4369, 0x7263, 0x7569, 0x74507974686E] } ,
          //{ services: ["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"]},
          { name: "CIRCUITPY015a" },
        ]
      };
      const device = await navigator.bluetooth.requestDevice(options);
      await device.gatt.connect();
      setDevice(device);
      setIsConnected(true);
      console.log('Connected to Bluetooth device');
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      setIsConnected(false);
    }
  };

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

  return (
    <div>
      <h2>Bluetooth</h2>
      {isConnected ? (
        <div>Device Connected</div>
      ) : (
        <div>Device Not Connected</div>
      )}
      <button onClick={connect}>Connect</button>
    </div>
  );
};

export default Bluetooth;
