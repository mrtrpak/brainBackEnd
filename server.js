import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { user, password, database } from './hidden.js';
import { handleRegister, handleSignin, handleProfileGet, handleImageGet } from './controllers/index.js';

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

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

// Can be used for profile page to update delete
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) });

app.put('/image', (req , res) => { handleImageGet(req, res, db )});

app.listen(3001, () => {
  console.log("is up and running");
});