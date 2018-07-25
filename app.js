var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
repositories = [];
require('datejs');
var serverjs = require('./public/scripts/server')
app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/cafes'));
app.use('/', require('./routes/articles'));
app.use('/', require('./routes/aboutus'));
app.use('/', require('./routes/contacts'));
app.use('/', require('./routes/store'))

// repoistories
var CoffeeRepository = require('./repositories/CoffeeRepository');
var CafeRepository = require('./repositories/CafeRepository');
var ArticleRepository = require('./repositories/ArticleRepository');
var BrewerRepository = require('./repositories/BrewerRepository');

app.getRepository = function(name){
  var repo;
  for(i=0; i<repositories.length; i++){
    if(repositories[i].name === name) repo = repositories[i];
  }
  if(!repo) {
    console.log(`Creating repo ${name}`);
    switch(name){
      case "CafeRepository":
        repo = new CafeRepository();
        break;
      case "ArticleRepository":
        repo = new ArticleRepository();
        break;
      case "CoffeeRepository":
        repo = new CoffeeRepository();
        break;
      case "BrewerRepository":
        repo = new BrewerRepository();
        break;
    }
    if(repo){
      repositories.push(repo);
    }
  }
  return repo;
};

// register main.js for use in Pug
app.locals.serverjs = serverjs;

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

module.exports = app;
