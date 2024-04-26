import React, { useState, useEffect } from 'react';

//let ble_device;
//let ble_server;
const BluetoothIcon = ({onConnect}) => {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [service, setService] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rxChara, setRxChara] = useState(null);
  const [receivedData, setReceivedData] = useState("");

  const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

  // Allows the micro:bit to transmit a byte array
  const UART_RX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

  // Allows a connected client to send a byte array
  const UART_TX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  let rxCharacteristic;

  const connect = async () => {
    try {
      if (device) return;
      const options = {
        filters: [
          { name: "Haptic Hero Controller" },
        ],
        optionalServices: [
            UART_SERVICE_UUID
        ]
      };
      console.log("device requested");
      const ble_device = await navigator.bluetooth.requestDevice(options);
      setDevice(ble_device);
      setIsConnected(true);

      const ble_server = await ble_device.gatt.connect();
      console.log("GATT connected");
      setServer(ble_server);
      
      console.log("About to get Primary service.");
      const ble_service = await ble_server.getPrimaryService(UART_SERVICE_UUID);
      setService(ble_service);
      console.log("Got primary service.");

      
        console.log("trying to get txcharacterestic");
        const txCharacteristic = await ble_service.getCharacteristic(
          UART_TX_CHARACTERISTIC_UUID
        );
        console.log("got tx characteresticm starting notifications...")
        txCharacteristic.startNotifications();
        //console.log("got notifications, adding event listener...")
        /*txCharacteristic.addEventListener(
          "characteristicvaluechanged",
          onTxCharacteristicValueChanged
        );*/
        //console.log("everything should be good for tx characterstic");
       

      rxCharacteristic = await ble_service.getCharacteristic(
        UART_RX_CHARACTERISTIC_UUID
      );
      setRxChara(rxCharacteristic);
      onConnect({rx: rxCharacteristic, tx: txCharacteristic});
      console.log('Connected to Bluetooth device');
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
      setIsConnected(false);
    }
  };

  function onTxCharacteristicValueChanged(event) {
    console.log("TX characterestic change detected");
    let data = event.target.value.getUint8(0);
    setReceivedData(receivedData);
    console.log(data);
  }

  const disconnect = () => {
    if (!device) return;
    if (device.gatt.connected) {
      device.gatt.disconnect();
      setIsConnected(false);
      console.log('Disconnected from Bluetooth device');
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      disconnect();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect]);

  const sendData = async (inputData) => {
    console.log("Data to send:", inputData);
    console.log("Trying to send data!");
    if (!rxChara) {
      console.log("No rxCharacterestic found.");
      return;
    }
  
    try {
      console.log("Sending data!");
      let encoder = new TextEncoder();
      await rxChara.writeValueWithoutResponse(encoder.encode(inputData + "\n"));
      console.log("Data sent!");
    } catch (error) {
      console.log(error);
    }
  };       

  return (
    <div>
      {isConnected ? (
        null
      ) : (
        <button onClick={connect}>Connect to Bluetooth</button>
      )}
    </div>
  );
};

export default BluetoothIcon;
