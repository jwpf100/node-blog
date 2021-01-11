const express = require('express');
const router = express.Router();

//Require controller modules
const api_controller = require('../controllers/apiController');

//GET request for all blogposts
router.get('/blogposts', api_controller.blogpost_list);

module.exports = router;
