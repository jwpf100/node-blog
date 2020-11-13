//Require the model used to access and update data
const Author = require('../models/author');
const BlogPost = require('../models/blogpost');
const async = require('async');
const { body, validationResult } = require('express-validator');
const { DateTime } = require('luxon');

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) {
        return next(err);
      }
      //Succesful
      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors,
      });
    });
};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      //Resolves to an array of BlogPosts (Mongoose model) objects that only contain the title and summary fields.
      authors_blogposts: function (callback) {
        BlogPost.find({ author: req.params.id }, 'title summary').exec(
          callback
        );
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.author == null) {
        // No results.
        let err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_blogposts: results.authors_blogposts,
      });
    }
  );
};

// Display Author create form on GET.
exports.create_author_form = function (req, res) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.create_author = [
  // Validate and sanitise fields.
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    //provide edited dates

    const author_data = {
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      date_birth_form: DateTime.fromJSDate(req.body.date_of_birth).toISODate(),
      date_death_form: DateTime.fromJSDate(req.body.date_of_death).toISODate(),
    };

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('author_form', {
        title: 'Create Author',
        author: author_data,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      let author = new Author(author_data);
      author.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  },
];

// Display Author delete form on GET.
//Nb. Author cannot be deleted if they have existing blog posts. Check below in place for blogposts by the author and logic in the author_delete page that hides the delete button and asks the user to delete blog posts before trying to delete the author.
exports.delete_author_form = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_blogposts: function (callback) {
        BlogPost.find({ author: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // No results.
        res.redirect('/blog/authors');
      }
      // Successful, so render.
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_blogposts: results.authors_blogposts,
      });
    }
  );
};

// Handle Author delete on POST.
//Nb. Author cannot be deleted if they have existing blog posts.
exports.delete_author = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      //Check for blog posts by the author.
      authors_blogposts: function (callback) {
        BlogPost.find({ author: req.body.authorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      // Success
      if (results.authors_blogposts.length > 0) {
        // The author has blog posts so cannot be deleted. Render the page the same as with the GET route - logic in the author_delete page that hides the delete button and asks the user to delete blog posts before trying to delete the author.
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_blogposts: results.authors_blogposts,
        });
        return;
      } else {
        // Author has no blog posts so ok to delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect('/blog/authors');
        });
      }
    }
  );
};

// Display Author update form on GET.
exports.update_author_form = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Author.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // No results.
        let err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render('author_form', {
        title: 'Edit Author',
        author: results.author,
      });
    }
  );
};

// Handle Author update on POST.
exports.update_author = [
  //Validate and Sanitise Fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  //Process request
  (req, res, next) => {
    //Extract validation errors
    const errors = validationResult(req);

    //Create an author object with escaped trimmed data and old ID.
    let author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //There are errors.  Render form again.
      res.render('author_form', {
        title: 'Edit Author',
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      //Data from form is valid.  Update the record.
      Author.findByIdAndUpdate(req.params.id, author, {}, function (
        err,
        theauthor
      ) {
        if (err) {
          return next(err);
        }
        //successful - redirect to tag detail page
        res.redirect(theauthor.url);
      });
    }
  },
];
