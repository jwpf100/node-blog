const BlogPost = require('../models/blogpost');

const async = require('async');

//Display list of all blog posts
exports.blogpost_list = function (req, res) {
  BlogPost.find({})
    .populate('author')
    .exec(function (err, list_blogposts) {
      if (err) {
        return async.nextTick(err);
      }
      res.json(list_blogposts);
    });
};
