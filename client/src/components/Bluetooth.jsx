import React, { useState, useEffect } from 'react';

const Bluetooth = () => {
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      const options = {
        filters: [
          { services: [0x603ec4a9, 0x6837, 0x44a5, 0xb388, 0xa910269edd43] } 
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
