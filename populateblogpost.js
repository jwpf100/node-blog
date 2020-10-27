var async = require('async')

const userArgs = ['mongodb://127.0.0.1:27017/node-blog'];

var BlogPost = require('./models/blogpost')

const mongoose = require('mongoose');
const { isBlockScoped } = require('babel-types');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.once('open', _ => {
  console.log('Database Node-Blog connected:', mongoDB)
})
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let blogpost = new BlogPost(
  {
    title: 'New Blog Post Title 2',
    author: "5f970506ac7954477e5f6fa4",
    summary: 'New Blog Post Summary 2',
    body: 'New Blog Post Body 2',
    tags: "5f970610caed2e480046f74a",
    status: 'Published'
  }
)

blogpost.save(function(err) {
  if (err) return console.log("There's an error " + err);
  //saved!
});





