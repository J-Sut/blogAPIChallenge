const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');

const {Blog} = require('./models');

const app = express();
app.use(bodyParser.json());

const blogRouter = require('./blogRouter');

app.use(morgan('common'));

// preloaded data since not working with DB yet
// BlogPosts.create('Harry Potter', 'it was a long book with a lot happening', 'J.K. Rowling', Date.now());
// BlogPosts.create('Mind Clear as a Crystal', 'When the waters of the mind calm, clarity results','J.M. Sutton', Date.now());

app.use('/blog', blogRouter);
	
// app.listen(process.env.PORT || 8080, () => {
// 	console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });  


// ************* From Integration Testing Challenge ****************

let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve(server);
        }).on('error', err => {
          reject(err)
      });   
    });
  });
};

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() =>{
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  });
};

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};