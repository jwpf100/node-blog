const express = require('express');
const router = express.Router();

//Require controller modules
const blogpost_controller = require('../controllers/blogpostController');
const author_controller = require('../controllers/authorController');
const tag_controller = require('../controllers/tagController');

/// BLOGPOST ROUTES ///

// GET catalog home page
router.get('/', blogpost_controller.index)

// GET request for creating a blogpost. NOTE This must come before routes that display BlogPosts (uses id).
router.get('/blogpost/create', blogpost_controller.blogpost_create_get);

// POST request for creating blogpost.
router.post('/blogpost/create', blogpost_controller.blogpost_create_post);

// GET request to delete Book.
router.get('/blogpost/:id/delete', blogpost_controller.blogpost_delete_get);

//POST request to delete Book
router.post('/blogpost/:id/delete', blogpost_controller.blogpost_delete_post);

// GET request to update blogpost.
router.get('/blogpost/:id/update', blogpost_controller.blogpost_update_get);

//POST request to update blogpost
router.post('/blogpost/:id/update', blogpost_controller.blogpost_update_post);

//GET request for one blogpost
router.get('/blogpost/:id', blogpost_controller.blogpost_detail);

//GET request for all blogposts
router.get('/blogposts', blogpost_controller.blogpost_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// tag ROUTES ///

// GET request for creating a tag. NOTE This must come before route that displays tag (uses id).
router.get('/tag/create', tag_controller.tag_create_get);

//POST request for creating tag.
router.post('/tag/create', tag_controller.tag_create_post);

// GET request to delete tag.
router.get('/tag/:id/delete', tag_controller.tag_delete_get);

// POST request to delete tag.
router.post('/tag/:id/delete', tag_controller.tag_delete_post);

// GET request to update tag.
router.get('/tag/:id/update', tag_controller.tag_update_get);

// POST request to update tag.
router.post('/tag/:id/update', tag_controller.tag_update_post);

// GET request for one tag.
router.get('/tag/:id', tag_controller.tag_detail);

// GET request for list of all tag.
router.get('/tags', tag_controller.tag_list);

module.exports = router;