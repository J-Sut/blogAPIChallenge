const uuid = require('uuid');
const mongoose = require('mongoose');

//make a schema for to represent a restaurant

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
});

blogSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    title: this.title,
    author: this.author,
    content: this.content,
  };
};

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
};

const Blog = mongoose.model('blogpost', blogSchema);

//module.exports.BlogPosts = createBlogPostsModel();
module.exports = {Blog};


//module.exports = {BlogPosts: createBlogPostsModel()};