const express = require('express');
const router = express.Router();
const cors = require('cors');

//Require controller modules
const api_controller = require('../controllers/apiController');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

//GET request for all blogposts
router.get('/blogposts', cors(corsOptions), api_controller.blogpost_list);

//GET request for single blogpost
router.get('/blogpost/:id', cors(corsOptions), api_controller.blogpost_detail);

module.exports = router;
