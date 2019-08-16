/*eslint-disable no-undef, no-implicit-globals*/
require('datejs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const serverjs = require('./public/scripts/server');
const supportedLangs = ['en-us', 'es-es'];
const languageNames = ['English', 'Spanish'];
const { zip } = require('rxjs');
const { map } = require('rxjs/operators');
const algoliasearch = require('algoliasearch/lite');
const config = require('./config');
const ArticleHelper = require('./helpers/article-helper');

app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//allow culture data access in views
app.locals.supportedLangs = supportedLangs;
app.locals.languageNames = languageNames;

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//force language prefix
app.use(['/:lang/*', '/:lang', '/'], function (req, res, next) {
  //save full URL to response for use in header
  app.locals.currentURL = req.originalUrl;

  let lang = req.params.lang ? req.params.lang.toLowerCase() : '';
  if(!supportedLangs.includes(lang)) {
    //prefix not found in route
    res.redirect('/en-us'+req.originalUrl);
  }
  else {
    //prefix was found, set culture
    app.set('currentCulture', lang); //available in middleware
    app.locals.currentCulture = lang; //available in views
    next();
  }
});

//generate Algolia index
app.use('/:lang/algolia', function (req, res, next) {
  let client = algoliasearch(config.algoliaApp, config.algoliaKey);
  let index = client.initIndex(config.indexName);

  //set index settings
  index.setSettings({
    attributesForFaceting: [
      'language',
      'type'
    ],
    typoTolerance: false,
    searchableAttributes: [
      'bodyCopy',
      'summary',
    ]
  });

  const obs = zip(
    ArticleHelper.getAllArticles('en-us', true).pipe(map(result => result.items)),
    ArticleHelper.getAllArticles('es-es', true).pipe(map(result => result.items))
  );

  const sub = obs.subscribe(result => {
    sub.unsubscribe();
    //add all articles to index
    result.flat(1).forEach(article => {
      index.addObject({
          objectID: article.system.id + '/' +article.system.language,
          title: article.title.value,
          language: article.system.language,
          postDate: new Date(article.postDate.value).toString('dddd, MMMM d, yyyy'),
          bodyCopy: article.bodyCopy.resolveHtml(),
          summary: article.summary.value,
          teaserImage: article.teaserImage.value[0].url,
          type: article.system.type
      });
    });

    res.redirect('/' + req.params.lang);
  });
});

//routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/cafes'));
app.use('/', require('./routes/articles'));
app.use('/', require('./routes/about-us'));
app.use('/', require('./routes/contacts'));
app.use('/', require('./routes/store'));
app.use('/', require('./routes/coffee'));
app.use('/', require('./routes/brewer'));
app.use('/', require('./routes/search'));

//register main.js for use in Pug
app.locals.serverjs = serverjs;

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  //set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;