var BlogPost = require('../models/blogpost');

//Function to display site homepage
exports.index = function(req, res) {
  res.send('NOT IMPLEMENTED: Site Home Page');
}

//Display list of all blog posts
exports.blogpost_list = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost list');
};

//Display detail page for a specific blogpost
exports.blogpost_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost detail: ' + req.params.id);
};

//Display blogpost create form on GET
exports.blogpost_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost create POST');
};

//Handle blogpost create on POST
exports.blogpost_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost delete GET');
};

//Display blogpost delete form on GET
exports.blogpost_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: blogpost delete POST');
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