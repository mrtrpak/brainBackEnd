import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { user, password, database } from './hidden.js';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: user,
    password: password,
    database: database
  }
});

db.select('*').from('users')
  .then(
    data => {
      console.log(data);
    }
  )

const app = express();

//middleware to read json
app.use(bodyParser.json());

// cors middleware
app.use(cors());

app.get('/', (req, res) => {
  res.send(mockDB.users);
});

app.post('/signIn', (req, res) => {

  // bcrypt.compare("bacon", hash, function(err, res) {
  // // res == true
  // });
  // bcrypt.compare("veggies", hash, function(err, res) {
  //   // res = false
  // });

  // if (req.body.email === mockDB.users[0].email && 
  //   req.body.password === mockDB.users[0].password) {
  //   res.json(mockDB.users[0]);
  // } else {
  //   res.status(400).json('error logging in');
  // };
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  let hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    }).into('login').returning('email').then(
      loginEmail => {
        return db('users').returning('*').insert({
          name: name,
          email: loginEmail,
          joined: new Date()
        }).then(user => {
          res.json(user[0])
        })
      })
  }).catch(
    () => res.status(400).json('unable to register')
  );
});

// Can be used for profile page to update delete
// When object key is same as value EX: id you can just write it once
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id }).then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json("not found")
    }
  }).catch(err => res.status(400))
});

app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users').where('id', '=', id).increment('entries', 1)
    .returning('entries').then(
      entries => {
        res.json(entries[0]);
      }
    ).catch(err => res.status(400).json('unable to get entries'))
});

app.listen(3001, () => {
  console.log("is up and running");
});