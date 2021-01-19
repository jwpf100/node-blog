const BlogPost = require('../models/blogpost');

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
