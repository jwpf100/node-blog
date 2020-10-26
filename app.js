//Import Node_libraries

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//manage .env data
var dotenv = require("dotenv")
dotenv.config()

//Import route handlers

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Create App

var app = express();

//Connect to MongoDB

const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/node-blog'

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true});

const db = mongoose.connection

db.once('open', _ => {
  console.log('Database Node-Blog connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Add (previously imported) route handling

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Export to be used by bin/www

module.exports = app;
