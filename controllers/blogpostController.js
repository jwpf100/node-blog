const BlogPost = require('../models/blogpost');
const Author = require('../models/author');
const Tag = require('../models/tag');

const async = require('async');
const { body, validationResult } = require('express-validator');

//Function to display site homepage
exports.index = function (req, res) {
  async.parallel(
    {
      blogpost_count: function (callback) {
        BlogPost.countDocuments({}, callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      tag_count: function (callback) {
        Tag.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Blog Admin Home',
        error: err,
        data: results,
      });
    }
  );
};

//Display list of all blog posts
exports.blogpost_list = function (req, res) {
  BlogPost.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_blogposts) {
      if (err) {
        return async.nextTick(err);
      }
      res.render('blogpost_list', {
        title: 'Blog Posts',
        blogpost_list: list_blogposts,
      });
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
      //Successful so render
      res.render('blogpost_detail', {
        title: results.blogpost.title,
        blogpost: results.blogpost,
      });
    }
  );
};

//Display blogpost create form on GET
exports.create_blogpost_form = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our Blog Post.
  async.parallel(
    {
      authors: function (callback) {
        Author.find(callback);
      },
      tags: function (callback) {
        Tag.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('blogpost_form', {
        title: 'Create Blog Post',
        authors: results.authors,
        tags: results.tags,
      });
    }
  );
};

//Handle blogpost create on POST
exports.create_blogpost = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.tag instanceof Array)) {
      if (typeof req.body.tag === 'undefined') req.body.tag = [];
      else req.body.tag = new Array(req.body.tag);
    }
    next();
  },

  // Validate and sanitise fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  // .escape(),
  body('tag.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Blog Post object with escaped and trimmed data.
    let blogpost = new BlogPost({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      body: req.body.body,
      body_delta: req.body.body_delta,
      image_filename: req.body.image_filename,
      tags: req.body.tag,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          tags: function (callback) {
            Tag.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected tags as checked.
          for (let i = 0; i < results.tags.length; i++) {
            if (blogpost.tag.indexOf(results.tags[i]._id) > -1) {
              results.tags[i].checked = 'true';
            }
          }
          res.render('blogpost_form', {
            title: 'Create Blog Post',
            authors: results.authors,
            tags: results.tags,
            blogpost: blogpost,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save Blog Post.
      blogpost.save(function (err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new Blog Post record.
        res.redirect(blogpost.url);
      });
    }
  },
];

//Display blogpost delete form on GET
exports.delete_blogpost_form = function (req, res, next) {
  async.parallel(
    {
      blogpost: function (callback) {
        BlogPost.findById(req.params.id).populate('author').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.blogpost == null) {
        //no results,
        res.redirect('blog/blogposts');
      }
      //Successful so render
      res.render('blogpost_delete', {
        title: 'Delete Blog Post',
        blogpost: results.blogpost,
      });
    }
  );
};

/*
app.get("/", async (req, res) => {
  const posts = await Post.find();
  const blogPosts = await BlogPost.find();
  res.render('index', { posts: posts, blogPosts: blogPosts })
});
*/

//Handle blogpost delete form on POST
exports.delete_blogpost = function (req, res, next) {
  async.parallel(
    {
      blogpost: function (callback) {
        BlogPost.findById(req.body.blogpostid).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.blogpost == null) {
        //no results
        let err = new Error('Blog Post not found');
        err.status = 404;
        return next(err);
      }

      //success
      BlogPost.findByIdAndRemove(req.body.blogpostid, function deleteBlogPost(
        err
      ) {
        if (err) {
          return next(err);
        }
        res.redirect('/blog/blogposts');
      });
    }
  );
};

//Display blogpost update form on GET
exports.update_blogpost_form = function (req, res, next) {
  // Get blog post, authors and genres for form.
  async.parallel(
    {
      blogpost: function (callback) {
        BlogPost.findById(req.params.id)
          .populate('author')
          .populate('tags')
          .exec(callback);
      },
      authors: function (callback) {
        Author.find(callback);
      },
      tags: function (callback) {
        Tag.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.blogpost == null) {
        // No results.
        let err = new Error('Blog Post not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (let all_t_iter = 0; all_t_iter < results.tags.length; all_t_iter++) {
        for (
          let blogpost_t_iter = 0;
          blogpost_t_iter < results.blogpost.tags.length;
          blogpost_t_iter++
        ) {
          if (
            results.tags[all_t_iter]._id.toString() ===
            results.blogpost.tags[blogpost_t_iter]._id.toString()
          ) {
            results.tags[all_t_iter].checked = 'true';
          }
        }
      }
      res.render('blogpost_form', {
        title: 'Update Blog Post',
        authors: results.authors,
        tags: results.tags,
        blogpost: results.blogpost,
      });
    }
  );
};

// Handle blogpost update on POST.
exports.update_blogpost = [
  // Convert the tag to an array
  (req, res, next) => {
    if (!(req.body.tag instanceof Array)) {
      if (typeof req.body.tag === 'undefined') req.body.tag = [];
      else req.body.tag = new Array(req.body.tag);
    }
    next();
  },

  // Validate and sanitise fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  // .escape(),
  //body('body', 'Body must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('tag.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BLogPost object with escaped/trimmed data and old id.
    let blogpost = new BlogPost({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      body: req.body.body,
      body_delta: req.body.body_delta,
      image_filename: req.body.image_filename,
      tags: typeof req.body.tag === 'undefined' ? [] : req.body.tag,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: function (callback) {
            Author.find(callback);
          },
          tags: function (callback) {
            Tag.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.tags.length; i++) {
            if (blogpost.tag.indexOf(results.tags[i]._id) > -1) {
              results.tags[i].checked = 'true';
            }
          }
          res.render('blogpost_form', {
            title: 'Update Blog Post',
            authors: results.authors,
            tags: results.tags,
            blogpost: blogpost,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Update the record.
      BlogPost.findByIdAndUpdate(req.params.id, blogpost, {}, function (
        err,
        theblogpost
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to blog post detail page.
        res.redirect(theblogpost.url);
      });
    }
  },
];
