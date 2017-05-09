const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {Blog, BlogPosts} = require('./models.js');
console.log(Blog);

// Do I need to add blog entries here just to have something 
// since we're not working with databases yet? 



// Get requests on root
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

// Post requests on root

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(200).json(post);
});

// Delete requests on root
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted shopping list item \`${req.params.id}\``);
	res.status(204).end();
});

// Put requests on root

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`; 
			console.error(message);
			return res.status(400).send(message);
		}	
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id `
			`(${req.body.id}) must match`);
		console.error(message);
		return res.status(400).send(message)
	}
	console.log(`Upadating blog post item \`${req.params.id}\``);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate	
	});
	res.status(201).json(updatedPost);
});


// ******* Requests made to /blogs *******

//Get request to restaurants => return 10 

router.get('/blogs', (req, res) => {
  const filters = {};
  const queryableFields = ['title', 'content', 'author'];
  queryableFields.forEach(field => {
    if (req.query[field]) {
      filters[field] = req.query[field];
    }
  });
  console.log(filters);
  Blog
    .find(filters)
    .exec()
    .then(Blog => res.json(
      Blogs.map(blog => blog.apiRepr())
      ))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});

// //get request by ID

// app.get('/restaurants/:id', (req, res) => {
//   Restaurant
//     .findbyId(req.params.id)
//     .exec()
//     .then(restaurant => res.json(restaurant.apiRepr()))
//     .catch(err => {
//       console.error(err);
//         res.status(500).json({message: 'Internal server error'})
//     });
// });

// app.post('/restaurants', (req, res) => {

//   const requiredFields = ['name', 'borough', 'cuisine'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       return res.status(400).send(message);
//     }
//   }

//   Restaurant
//     .create({
//       name: req.body.name,
//       borough: req.body.borough,
//       cuisine: req.body.cuisine,
//       grades: req.body.grades,
//       address: req.body.address})
//     .then(
//       restaurant => res.status(201).json(restaurant.apiRepr()))
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({message: 'Internal server error'});
//   });
// });

// app.put('/restaurants/:id', (res, res) => {

//   if (! (req.params.id && req.body.id === req.body.id)) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id ` +
//       `(${req.body.id}) must match`);
//     console.error(message);
//     res.status(400).json({message: message});
//   }

//   const toUpdate = {};  
//   const updateableFields = ['name', 'borough', 'cuisine', 'address'];

//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });

//   Restaurant
//     .findByIdAndUpdate(req.params.id, {$set: toUpdate})
//     .exec()
//     .then(restaurant => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

// app.delete('restaurants/:id', (req, res) => {
//   Restaurant
//     .findByIdAndRemove(req.params.id)
//     .exec()
//     .then(restaurant => res.status(204).end())
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });


module.exports = router















