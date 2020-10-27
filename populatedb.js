#! /usr/bin/env node

console.log('This script populates some test documents');

// Get arguments passed on command line
//var userArgs = process.argv.slice(2);
var userArgs = ['mongodb://127.0.0.1:27017/node-blog'];

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

var BlogPost = require('./models/blogpost')
var Author = require('./models/author')
var Tag = require('./models/tag')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var tags = []
var blogposts = []

function authorCreate(first_name, family_name, d_birth, cb) {
  authordetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  
  var author = new Author(authordetail);
       
  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function tagCreate(name, cb) {
  var tag = new Tag({ name: name });
       
  tag.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Tag: ' + tag);
    tags.push(tag)
    cb(null, tag);
  }   );
}

function blogPostCreate(title, summary, body, author, tags, cb) {
  blogpostdetail = { 
    title: title,
    author: author,
    summary: summary,
    body: body,
//    post_date: Date.now()
  }
  if (tags != false) blogpostdetail.tags = tags
    
  var blogpost = new BlogPost(blogpostdetail);    
  blogpost.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blog Post: ' + blogpost);
    blogposts.push(blogpost)
    cb(null, blogpost)
  }  );
}


function createTagAuthors(cb) {
    async.series([
        function(callback) {
          authorCreate('Joe', 'Fletcher', '1983-09-01', callback);
        },
        function(callback) {
          authorCreate('Nicola', 'Thomas', '1985-04-30', callback);
        },
        function(callback) {
          authorCreate('Another', 'Author', '1965-01-02', callback);
        },
        function(callback) {
          tagCreate("Fantasy", callback);
        },
        function(callback) {
          tagCreate("Science Fiction", callback);
        },
        function(callback) {
          tagCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createBlogPosts(cb) {
    async.parallel([
        function(callback) {
          blogPostCreate('Blog Post 1', 'Summary of Blog Post 1', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', authors[0], [tags[0]], callback);
        },
/*        function(callback) {
          blogPostCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)",'Summary of Blog Post 2', 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', authors[0], [tags[0]], callback);
        },
        function(callback) {
          blogPostCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)",'Summary of Blog Post 3', 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [tags[0]], callback);
        },
        function(callback) {
          blogPostCreate("Apes and Angels", 'Summary of Blog Post 4',"Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", authors[1], [tags[1]], callback);
        },
        function(callback) {
          blogPostCreate("Death Wave", 'Summary of Blog Post 5',"In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", authors[1], [tags[1]], callback);
        }*/
        ],
        // optional callback
        cb);
}



async.series([
    //createTagAuthors,
    createBlogPosts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Did this work?');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
