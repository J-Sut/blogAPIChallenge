const express = require('express');
const morgan = require('morgan');

const {BlogPosts} = require('./models');

const app = express();

const blogRouter = require('./blogRouter');

app.use(morgan('common'));

// preloaded data since not working with DB yet
BlogPosts.create('Harry Potter', 'it was a long book with a lot happening', 'J.K. Rowling', Date.now());
BlogPosts.create('Mind Clear as a Crystal', 'When the waters of the mind calm, clarity results','J.M. Sutton', Date.now());

app.use('/blog', blogRouter);
app.use('/blog/comments', commentRouter);
//GET http://localhost:8080/blog/
//POST http://localhost:8080/blog/
//GET http://localhost:8080/blog/comments/

app.listen(process.env.PORT || 8080, () => {
	console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});