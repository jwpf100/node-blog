//Require mongoose
const { isModuleSpecifier } = require('babel-types');
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
  }
);

//Virtual for author's full name (Create full name from first and family)

AuthorSchema
  .virtual('name')
  .get(() => {
    return this.family_name + ', ' + this.first_name;
  });

//Virtual to set a unique URL for the author based on it's _id
AuthorSchema
  .virtual('url')
  .get(() => {
    return '/blog/author/' + this._id;
  });

//Export the module
module.exports = mongoose.model('Author', AuthorSchema);
