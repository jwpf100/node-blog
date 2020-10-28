const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const BlogPostSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    body: {type: String, required: true},
    post_date: {type: Date, default: Date.now()},
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    status: {type: String, required: true, enum: ['Published', 'Draft', 'Submitted'], default: 'Published' }
  }
);

//Nb.  Included status, default should be draft but can add functionality in to have a review process

// Virtual for book's URL
BlogPostSchema
.virtual('url')
.get(function () {
  return '/blog/blogpost/' + this._id;
});

// Virtual for author's date of birth
BlogPostSchema
.virtual('post_date_edited')
.get(function () {
  return this.post_date ? DateTime.fromJSDate(this.post_date).toLocaleString(DateTime.DATE_MED) : '';
});

//'Author' Object ID is a reference to the Author Model exported from the author.js file

//Export the module
module.exports = mongoose.model('BlogPost', BlogPostSchema);