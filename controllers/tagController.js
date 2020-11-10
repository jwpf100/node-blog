const Tag = require('../models/tag');
const BlogPost = require('../models/blogpost');
const async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all tags.
exports.tag_list = function(req, res) {

  Tag.find()
  .sort([['name', 'ascending']])
  .exec(function (err, list_tags) {
    if (err) {return Next(err); }
    //succesful
    res.render('tag_list', {title: 'List of Tags', tag_list: list_tags});
  });
};

// Display detail page for a specific tag.
exports.tag_detail = function(req, res, next) {
    
  async.parallel({
    tag: function(callback) {
      Tag.findById(req.params.id)  // params.id refers to the url request which has the id at the end
        .exec(callback);
    },

    tag_blogposts: function(callback) {
      BlogPost.find({ 'tags': req.params.id })  // params.id refers to the url request which has the id at the end
        .exec(callback)
    },
  
  }, function(err, results) {
    if(err) {return next(err); }
    if (results.tag == null) { //No results.
      let err = new Error('Tags not found');
      err.status = 404;
      return next(err);
    }
    //successful, so render page
    res.render('tag_detail',  {title: 'Tagged Posts', tag: results.tag, tag_blogposts: results.tag_blogposts });
  });
};

// Display tag create form on GET.
exports.tag_create_get = function(req, res, next) {
  res.render('tag_form', { title: 'Create New Tag' });
};

// Handle tag create on POST.
exports.tag_create_post =  [
   
  // Validate and santise the name field.
  //body('name', 'Tag name required').trim().isLength({ min: 3 }).escape(),

  body('name', 'Tag name required')
    .trim()
    .isLength({min:3}).withMessage('Min length 3 characters')
    .isAlpha().withMessage("Tag can't contain numbers")
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    let tag = new Tag(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('tag_form', { title: 'Create Tag', tag: tag, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Tag.findOne({ 'name': req.body.name })
        .exec( function(err, found_tag) {
          if (err) { return next(err); }

          if (found_tag) {
             // Genre exists, redirect to its detail page.
            res.redirect(found_tag.url);
          }
          else {

            tag.save(function (err) {
              if (err) { return next(err); }
               // Genre saved. Redirect to genre detail page.
              res.redirect(tag.url);
            });

          }

        });
    }
  }
];

// Display tag delete form on GET.
exports.tag_delete_get = function(req, res, next) {

  async.parallel({
      tag: function(callback) {
          Tag.findById(req.params.id).exec(callback)
      },
      tags_blogposts: function(callback) {
        BlogPost.find({ 'tags': req.params.id }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.tag==null) { // No results.
          res.redirect('/blog/tags');
      }
      // Successful, so render.
      res.render('tag_delete', { title: 'Delete Tag', tag: results.tag, tag_blogposts: results.tags_blogposts } );
  });

};

// Handle tag delete on POST.
exports.tag_delete_post = function(req, res, next) {
  async.parallel({
      tag: function(callback) {
        Tag.findById(req.body.tagid).exec(callback)
      },
      tags_blogposts: function(callback) {
        BlogPost.find({ 'tags': req.body.tagid }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      
      // Success
      if (results.tags_blogposts.length > 0) {
          // Author has books. Render in same way as for GET route.
          res.render('tag_delete', { title: 'Delete Tag', tag: results.tag, tag_blogposts: results.tags_blogposts } );
          return;
      }
      else {
          // Author has no books. Delete object and redirect to the list of authors.
          Tag.findByIdAndRemove(req.body.tagid, function deleteTag(err) {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/blog/tags')
          })
      }
  });
};

// Display tag update form on GET.
exports.tag_update_get = function(req, res, next) {

  // Get blog post, authors and genres for form.
  async.parallel({
      tag: function(callback) {
          Tag.findById(req.params.id)
          .exec(callback);
      },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.tag==null) { // No results.
              let err = new Error('Tag not found');
              err.status = 404;
              return next(err);
          }
          // Success.
          res.render('tag_form', { title: 'Edit Tag', tag: results.tag });
      });
};



// Handle tag update on POST.
exports.tag_update_post = [

    //Validate and Sanitise Fields
    body('name', 'Tag name required')
    .trim()
    .isLength({min:3}).withMessage('Min length 3 characters')
    .isAlpha().withMessage("Tag can't contain numbers")
    .escape(),

    //Process request
    (req, res, next) => {

      //Extract validation errors
      const errors = validationResult(req);

      //Create a tag object with escaped trimmed data and old ID.
      let tag = new Tag(
        {name: req.body.name,
        _id: req.params.id
      });

      if (!errors.isEmpty()) {
        //There are errors.  Render form again.
          res.render('tag_form', { title: 'Edit Tag', tag: tag, errors: errors.array() })
          return;
      }
      else {
        //Data from form is valid.  Update the record.
        Tag.findByIdAndUpdate(req.params.id, tag, {}, function (err, thetag) {
          if (err) { return next(err); }
          //successful - redirect to tag detail page
          res.redirect(thetag.url);
        });
      }
    }
];
