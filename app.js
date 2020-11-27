//Import Node_libraries

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//manage .env data
const dotenv = require('dotenv');
dotenv.config();

//Import route handlers

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

// Create App

const app = express();

//Connect to MongoDB

const mongoose = require('mongoose');
//Local DB
//const url = 'mongodb://127.0.0.1:27017/node-blog';
//Cloud Atlas
const url = `mongodb+srv://${process.env.CLOUDDB_USERNAME}:${process.env.CLOUDDB_PASSWORD}@nodeblogjoe.iuune.mongodb.net/<dbname>?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Database Node-Blog connected:', url);
});

db.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('connection error:', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Add (previously imported) route handling

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Export to be used by bin/www

module.exports = app;
