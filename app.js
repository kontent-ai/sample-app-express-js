/*eslint-disable no-undef, no-implicit-globals*/
import { config } from 'dotenv';
config();
import createError from 'http-errors';
import express, { urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import logger from 'morgan';
import { formatPrice } from './public/scripts/server.js';
const supportedLangs = ['en-US', 'es-ES'];
const languageNames = ['English', 'Spanish'];
import algoliasearch from 'algoliasearch/lite.js';
import ArticleHelper from './helpers/article-helper.js';
import path from 'path';
import { fileURLToPath } from 'url';
import webhook from './routes/webhook.js';
import push from './routes/push.js';
import push_cm from './routes/push_cm.js'
import subscribe from './routes/subscribe.js';
import index from './routes/index.js';
import cafes from './routes/cafes.js';
import articles from './routes/articles.js';
import aboutUs from './routes/about-us.js';
import contacts from './routes/contacts.js';
import store from './routes/store.js';
import coffee from './routes/coffee.js';
import brewer from './routes/brewer.js';
import search from './routes/search.js';
import { resolveRichText } from './resolvers/rich-text-resolver.js'

const { raw } = BodyParser;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(logger('dev'));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(raw({type:'application/json'}));
app.use(express.static(join(__dirname, 'public')));

//allow culture data access in views
app.locals.supportedLangs = supportedLangs;
app.locals.languageNames = languageNames;
//allow access in routers
app.set('supportedLangs', supportedLangs);

//view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', webhook);
app.use('/', push);
app.use('/', push_cm)
app.use('/', subscribe);

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
app.use('/:lang/algolia', (req, res, next) => {
  const client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
  const index = client.initIndex(process.env.indexName);

  //set index settings
  index.setSettings({
    'attributesForFaceting': [
      'language',
      'type'
    ],
    'typoTolerance': false,
    'searchableAttributes': [
      'bodyCopy',
      'summary',
    ]
  });

  const allArticles = supportedLangs.map(lang => ArticleHelper.getAllArticles(lang, true).then(result => result.data.items));
  Promise.all(allArticles).then(result => {
    //add all articles to index
    result.flat(1).forEach(article => {
      index.saveObject({
          objectID: `${article.system.id}/${article.system.language}`,
          title: article.elements.title.value,
          language: article.system.language,
          postDate: new Date(article.elements.postDate.value).toString('dddd, MMMM d, yyyy'),
          bodyCopy: resolveRichText(article.elements.bodyCopy),
          summary: article.elements.summary.value,
          teaserImage: article.elements.teaserImage.value[0].url,
          type: article.system.type
      });
    });

    res.redirect(`/${req.params.lang}`);
  });
});

//routes
app.use('/', index);
app.use('/', cafes);
app.use('/', articles);
app.use('/', aboutUs);
app.use('/', contacts);
app.use('/', store);
app.use('/', coffee);
app.use('/', brewer);
app.use('/', search);

//register main.js for use in Pug
app.locals.formatPrice = formatPrice;

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