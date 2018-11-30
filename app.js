const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
repositories = [];
require('datejs');
const serverjs = require('./public/scripts/server')
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
app.use('/', require('./routes/about-us'));
app.use('/', require('./routes/contacts'));
app.use('/', require('./routes/store'));
app.use('/', require('./routes/coffee'));
app.use('/', require('./routes/brewer'));

// repoistories
const CoffeeRepository = require('./repositories/coffee-repository');
const CafeRepository = require('./repositories/cafe-repository');
const ArticleRepository = require('./repositories/article-repository');
const BrewerRepository = require('./repositories/brewer-repository');
const StoreRepository = require('./repositories/store-repository');

app.getRepository = function(name){
  let repo;
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
      case "StoreRepository":
        repo = new StoreRepository();
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
