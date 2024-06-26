// connects to serialport via server - for testing purposes only
import { SerialPort, ReadlineParser } from 'serialport';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const picoVendorId = '239A';
const picoProductId = '80F4';
let picoPort = null;
let port = null;

const startMarker = Buffer.from('AUDIO_START');
const endMarker = Buffer.from('AUDIO_END');

const connectToSerialPort = () => {
  SerialPort.list().then(ports => {
    picoPort = ports.find(port => {
      return port.vendorId == picoVendorId && port.productId == picoProductId;
    });

    if (picoPort) {
      console.log(`Found Raspberry Pi Pico at ${picoPort.path}`);
      port = new SerialPort({
        path: picoPort.path,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });
      const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n\r\n' }));

      port.on('open', () => {
        console.log('Serial port opened.');
        /**console.log('About to write data to serial port');

        const dataToSend = "Hello from the Web!\n";
        const intervalId = setInterval(() => {
          port.write(dataToSend, (err) => {
            if (err) {
              console.error('Error writing to serial port:', err);
            } else {
              console.log('Data sent to Pico:', dataToSend);
            }
          });
        }, 1000);**/
      });

      parser.on('data', (data) => {
        console.log(`Data from Pico: ${data}`);
      });

      parser.on('error', (err) => {
        console.error('Parser error:', err);
      });

      port.on('error', (err) => {
        console.error('Error on serial port:', err);
      });

      port.on('close', () => {
        console.log('Serial port closed.');
      });
    } else {
      console.log('Raspberry Pi Pico not found.');
    }
  });
};
const disconnectFromSerialPort = () => {
    if (port && port.isOpen) {
      port.close((err) => {
        if (err) {
          console.error('Error closing serial port:', err);
        } else {
          console.log('Serial port closed.');
        }
      });
    }
  };
const writeDataToSerial = (data) => {
  const audioData = fs.readFileSync(path.join(__dirname, "../songs/sample_song.wav"));
  const formattedData = Buffer.concat([Buffer.from(data), startMarker, audioData, endMarker]);
  if (port && port.isOpen) {
    console.log("WRITING DATA: " + formattedData)
      port.write(formattedData, (err) => {
      if (err) {
          console.error('Error writing to serial port:', err);
      } else {
          console.log('Data sent to Pico:', data);
      }
      });
  } else {
      console.error('Serial port is not open.');
  }
};

export { connectToSerialPort, disconnectFromSerialPort, writeDataToSerial };