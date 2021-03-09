import Clarifai from 'clarifai';
import { apiKey } from '../hidden.js';

const app = new Clarifai.App({
  apiKey: apiKey
});

export const handleImageGet = db => (req, res) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries')
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};