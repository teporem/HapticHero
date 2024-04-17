import express from 'express';
//import session from 'express-session';
//import redis from 'redis';
//import RedisStore from 'connect-redis';
import cors from 'cors';
import configRoutes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000','https://teporem.github.io', 'https://www.haptichero.site', 'https://haptichero.site']
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const options = {
  cert: readFileSync('/etc/letsencrypt/live/server.haptichero.site/fullchain.pem'),
  key: readFileSync('/etc/letsencrypt/live/server.haptichero.site/privkey.pem')
}

configRoutes(app);

https.createServer(options, app).listen(443);
console.log('Your server will be running on 443');
/*
app.listen(443, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3001');
});*/