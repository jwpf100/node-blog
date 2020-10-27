//Require mongoose
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

//Define a schema
const Schema = mongoose.Schema

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
  }
);

//Virtual for author's full name (Create full name from first and family)

AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });

// Virtual for author's date of birth
AuthorSchema
.virtual('date_birth_edited')
.get(function () {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

//Virtual to set a unique URL for the author based on it's _id
AuthorSchema
  .virtual('url')
  .get(function() {
    return '/blog/author/' + this._id;
  });

//Export the module
module.exports = mongoose.model('Author', AuthorSchema);
