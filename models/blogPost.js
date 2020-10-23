const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogPostSchema = new Schema(
  {
    body: String
  }
);

module.exports = mongoose.model('BlogPost', blogPostSchema)