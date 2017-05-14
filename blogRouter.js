const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blog} = require('./models');

// ******* Requests made to /blog *******

//Get request to restaurants => return 10 

router.get('/posts', (req, res) => {
	const filters = {};
  const queryableFields = ['title', 'content', 'author'];
  queryableFields.forEach(field => {
    if (req.query[field]) {
      filters[field] = req.query[field];
    }
  });
  Blog
  .find(filters)
  .exec()
  .then(posts => {
  	res.json(
  		posts.map(post => post.apiRepr())
  	)
  })
  .catch(err => {
  	console.error(err);
  	res.status(500).json({message: 'Internal server error'})
  });
});

// //get request by ID

router.get('/posts/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .exec()
    .then(post => res.json(post.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.post('/posts', (req, res) => {

  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      return res.status(400).send(message);
    };
  };

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author})
    .then(
      post => res.status(201).json(post.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
 });

router.put('/posts/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  };

  const toUpdate = {};  
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Blog
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .exec()
    .then(post => res.json(post.apiRepr()).status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/posts/:id', (req, res) => {
  	console.log('1 before statment');

  Blog
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Page Not Found...keep looking'});
});

module.exports = router






