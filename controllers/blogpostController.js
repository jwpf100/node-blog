var BlogPost = require('../models/blogpost');
var Author = require('../models/author')
var Tag = require('../models/tag')

var async = require('async');
const { body,validationResult } = require('express-validator');

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
exports.blogpost_create_get = function(req, res, next) { 
      
  // Get all authors and genres, which we can use for adding to our Blog Post.
  async.parallel({
      authors: function(callback) {
          Author.find(callback);
      },
      tags: function(callback) {
          Tag.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('blogpost_form', { title: 'Create Blog Post', authors: results.authors, tags: results.tags });
  });
  
};

//Handle blogpost create on POST
exports.blogpost_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
      if(!(req.body.tag instanceof Array)){
          if(typeof req.body.tag ==='undefined')
          req.body.tag = [];
          else
          req.body.tag = new Array(req.body.tag);
      }
console.log(req.body.tag)
      next();
  },

  // Validate and sanitise fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('tag.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
      
      // Extract the validation errors from a request.
      const errors = validationResult(req);
console.log(errors)
      // Create a Blog Post object with escaped and trimmed data.
      var blogpost = new BlogPost(
        { title: req.body.title,
          author: req.body.author,
          summary: req.body.summary,
          body: req.body.body,
          tags: req.body.tag
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and genres for form.
          async.parallel({
              authors: function(callback) {
                  Author.find(callback);
              },
              tags: function(callback) {
                  Tag.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }

              // Mark our selected genres as checked.
              for (let i = 0; i < results.tags.length; i++) {
                  if (blogpost.tag.indexOf(results.tags[i]._id) > -1) {
                      results.tags[i].checked='true';
                  }
              }
              res.render('blogpost_form', { title: 'Create Blog Post',authors:results.authors, tags:results.tags, blogpost: blogpost, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Save Blog Post.
          blogpost.save(function (err) {
              if (err) { return next(err); }
                 //successful - redirect to new Blog Post record.
                res.redirect(blogpost.url);
              });
      }
  }
];







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