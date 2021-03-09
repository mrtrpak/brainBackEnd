import Clarifai from 'clarifai';
import { apiKey } from '../hidden.js';

const app = new Clarifai.App({
  apiKey: apiKey
});

export const handleApiCall = (req, res) => {
  app.models
    .predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('api not working properly'));
};

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