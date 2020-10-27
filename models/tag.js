const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: { type: String, required: true , maxlength: 100, minlength: 3}, 
  }
);

// Virtual for tag's URL
TagSchema
.virtual('url')
.get(function () {
  return '/blog/tag/' + this._id;
});

//Export model
module.exports = mongoose.model('Tag', TagSchema);