/*eslint-disable no-undef, no-implicit-globals*/
import 'datejs';
import { config } from 'dotenv';
config();
import createError from 'http-errors';
import express, { urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { raw } from 'body-parser';
import logger from 'morgan';
import serverjs from './public/scripts/server';
const supportedLangs = ['en-US', 'es-ES'];
const languageNames = ['English', 'Spanish'];
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import algoliasearch from 'algoliasearch/lite';
import { getAllArticles } from './helpers/article-helper';

app = express();
app.use(logger('dev'));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(raw({type:'application/json'}))
app.use(express.static(join(__dirname, 'public')));

//allow culture data access in views
app.locals.supportedLangs = supportedLangs;
app.locals.languageNames = languageNames;
//allow access in routers
app.set('supportedLangs', supportedLangs);

//view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', require('./routes/webhook'));
app.use('/', require('./routes/push'));
app.use('/', require('./routes/subscribe'));

//force language prefix
app.use(['/:lang/*', '/:lang', '/'], function (req, res, next) {
  //save full URL for use in site header
  app.locals.currentURL = req.originalUrl;
  if(req.originalUrl.includes('/public/')) next();

  const lang = req.params.lang ? req.params.lang : '';

  if(supportedLangs.includes(lang)) {
    /*
     * prefix was found, set culture.
     * app.set() available in middleware,
     * app.locals available in views
     */
    app.set('currentCulture', lang);
    app.locals.currentCulture = lang;
    next();
  }
  else {
    //prefix not found in route- use default (first in list)
    res.redirect(`/${supportedLangs[0]}${req.originalUrl}`);
  }
});

//generate Algolia index
app.use('/:lang/algolia', function (req, res, next) {
  const client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
  const index = client.initIndex(process.env.indexName);

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

  const observers = supportedLangs.map(lang => getAllArticles(lang, true).pipe(map(result => result.items)));
  const sub = zip(...observers).subscribe(result => {
    sub.unsubscribe();
    //add all articles to index
    result.flat(1).forEach(article => {
      index.addObject({
          objectID: `${article.system.id}/${article.system.language}`,
          title: article.title.value,
          language: article.system.language,
          postDate: new Date(article.postDate.value).toString('dddd, MMMM d, yyyy'),
          bodyCopy: article.bodyCopy.resolveHtml(),
          summary: article.summary.value,
          teaserImage: article.teaserImage.value[0].url,
          type: article.system.type
      });
    });

    res.redirect(`/${req.params.lang}`);
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

export default app;