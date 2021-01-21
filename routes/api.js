const express = require('express');
const router = express.Router();

//Require controller modules
const api_controller = require('../controllers/apiController');

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200,
// };

//GET request for all blogposts
router.get('/blogposts', api_controller.blogpost_list);

//GET request for single blogpost
router.get('/blogpost/:id', api_controller.blogpost_detail);

//GET request for all blogposts
router.get('/authors', api_controller.author_list);

//GET request for all blogposts
router.get('/tags', api_controller.tag_list);

module.exports = router;
