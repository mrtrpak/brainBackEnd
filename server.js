import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { user, password, database } from './hidden.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: user,
    password: password,
    database: database
  }
});

const validatedEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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
// When object key is same as value EX: id you can just write it once
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      };
    })
    .catch(err => res.status(400));
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries')
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3001, () => {
  console.log("is up and running");
});