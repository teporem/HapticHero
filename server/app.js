import express from 'express';
//import session from 'express-session';
//import redis from 'redis';
//import RedisStore from 'connect-redis';
import cors from 'cors';
import configRoutes from './routes/index.js';

const app = express();
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}
));
app.use(express.json());

configRoutes(app);

app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3001');
});
