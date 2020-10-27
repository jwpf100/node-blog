const Tag = require('../models/tag');
const BlogPost = require('../models/blogpost');
const async = require('async');

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
      var err = new Error('Tags not found');
      err.status = 404;
      return next(err);
    }
    //successful, so render page
    res.render('tag_detail',  {title: 'Tagged Posts', tag: results.tag, tag_blogposts: results.tag_blogposts });
  });
};

// Display tag create form on GET.
exports.tag_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: tag create GET');
};

// Handle tag create on POST.
exports.tag_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: tag create POST');
};

// Display tag delete form on GET.
exports.tag_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: tag delete GET');
};

// Handle tag delete on POST.
exports.tag_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: tag delete POST');
};

// Display tag update form on GET.
exports.tag_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: tag update GET');
};

// Handle tag update on POST.
exports.tag_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: tag update POST');
};