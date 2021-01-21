const BlogPost = require('../models/blogpost');
const Author = require('../models/author');
const Tag = require('../models/tag');

const async = require('async');

//Display list of all blog posts
exports.blogpost_list = function (req, res) {
  BlogPost.find({})
    .populate('author tags')
    .exec(function (err, list_blogposts) {
      if (err) {
        return async.nextTick(err);
      }
      res.json(list_blogposts);
    });
};

//Display detail page for a specific blogpost
exports.blogpost_detail = function (req, res) {
  async.parallel(
    {
      blogpost: function (callback) {
        BlogPost.findById(req.params.id)
          .populate('author')
          .populate('tags')
          .exec(callback);
      },
    },
    function (err, results, next) {
      if (err) {
        return next(err);
      }
      if (results.blogpost == null) {
        //No results
        let err = new Error('BlogPost not found');
        err.status = 404;
        return next(err);
      }
      //Successful so return
      res.json(results.blogpost);
    }
  );
};

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      //Succesful
      res.json(list_authors);
    });
};

// Display list of all tags.
exports.tag_list = function (req, res, next) {
  Tag.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_tags) {
      if (err) {
        return next(err);
      }
      //succesful
      res.json(list_tags);
    });
};
