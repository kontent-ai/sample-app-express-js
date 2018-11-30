/*eslint-disable no-undef, no-implicit-globals*/
require('datejs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const serverjs = require('./public/scripts/server')
const repositories = [];

app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/cafes'));
app.use('/', require('./routes/articles'));
app.use('/', require('./routes/about-us'));
app.use('/', require('./routes/contacts'));
app.use('/', require('./routes/store'));
app.use('/', require('./routes/coffee'));
app.use('/', require('./routes/brewer'));

//repoistories
const CoffeeRepository = require('./repositories/coffee-repository');
const CafeRepository = require('./repositories/cafe-repository');
const ArticleRepository = require('./repositories/article-repository');
const BrewerRepository = require('./repositories/brewer-repository');
const StoreRepository = require('./repositories/store-repository');

app.getRepository = function(name){
  let repo;

  for(let index = 0; index < repositories.length; index += 1){
    if(repositories[index].name === name) repo = repositories[index];
  }
  if(!repo) {
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
      default:
        break;
    }
    if(repo){
      repositories.push(repo);
    }
  }

  return repo;
};

//register main.js for use in Pug
app.locals.serverjs = serverjs;

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {//eslint-disable-line
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;