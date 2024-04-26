import express from 'express';
//import session from 'express-session';
//import redis from 'redis';
//import RedisStore from 'connect-redis';
import cors from 'cors';
import configRoutes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

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

configRoutes(app);

app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3001');
});