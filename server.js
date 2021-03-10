import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { user, password, database } from './hidden.js';
import { handleRegister, handleSignin, handleProfileGet, handleImageGet, handleApiCall } from './controllers/index.js';

const PORT = process.env.PORT || 3001;

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: user,
    password: password,
    database: database
  }
});

const app = express();

//middleware to read json
app.use(bodyParser.json());

// cors middleware
app.use(cors());
app.get('/', (req, res) => { res.send('it is working!') });
app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
// Can be used for profile page to update delete in future
app.get('/profile/:id', handleProfileGet(db));
app.put('/image', handleImageGet(db));
app.post('/imageurl', (req, res) => { handleApiCall(req, res) });

app.listen(PORT, () => {
  console.log(`is up and running on ${PORT}`);
});