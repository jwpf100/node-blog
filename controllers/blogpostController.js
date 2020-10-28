var BlogPost = require('../models/blogpost');
var Author = require('../models/author')
var Tag = require('../models/tag')

var async = require('async');

//Function to display site homepage
exports.index = function(req, res) {
  
  async.parallel({
    blogpost_count: function(callback) {
      BlogPost.countDocuments({}, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    tag_count: function(callback) {
      Tag.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', {title: 'Node Blog Home', error: err, data: results });
  });
};

//Display list of all blog posts
exports.blogpost_list = function(req, res) {
  BlogPost.find({}, 'title author')
  .populate('author')
  .exec(function (err, list_blogposts) {
    if (err) { return async.nextTick(err); }
    res.render('blogpost_list', {title: 'Blog Posts', blogpost_list: list_blogposts});
  })
};

//Display detail page for a specific blogpost
exports.blogpost_detail = function(req, res) {

  async.parallel({
    blogpost: function(callback) {

      BlogPost.findById(req.params.id)
        .populate('author')
        .populate('tags')
        .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.blogpost == null) { //No results
        let err = new Error('BlogPost not found');
        err.status = 404;
        return next(err);
  }
  //Successful so render
  res.render('blogpost_detail', {title: results.blogpost.title, blogpost: results.blogpost } );
});

};

//Display blogpost create form on GET
exports.blogpost_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost create GET');
};

//Handle blogpost create on POST
exports.blogpost_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost delete POST');
};

//Display blogpost delete form on GET
exports.blogpost_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost delete GET');
};

//Handle blogpost delete form on POST
exports.blogpost_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost delete POST');
};

//Display blogpost update form on GET
exports.blogpost_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost update GET');
};

//Handle blogpost update on POST
exports.blogpost_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost update POST');
};