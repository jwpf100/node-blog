//Setup
var express = require('express');
var app = express();

//Template engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Set up route for "/" or root directory

// app.get("/", (req, res) => {
//   Post.find({}, (err, posts) => {
//      res.render('index', { posts: posts})
//   });
// });

app.get("/", (req, res) => {
  res.render('index');
});


//connect to mongo via mongoose
/*
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/node-blog'

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})
*/
//Middleware
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

//Create schema and model
const postSchema = new mongoose.Schema({ body: String });
var Post = mongoose.model('Post', postSchema);

//create addpost method

app.post('/addpost', (req, res) => {
  var postData = new Post(req.body);
  postData.save().then( result => {
      res.redirect('/');
  }).catch(err => {
      res.status(400).send("Unable to save data");
  });
});


//Listen
app.listen(3000, () => {
  console.log('Server listening on 3000');
});
