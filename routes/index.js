const express = require('express');
const router = express.Router();
const ArticleHelper = require('../helpers/article-helper');
const CafeHelper = require('../helpers/cafe-helper');
const { zip } = require('rxjs');
const { map } = require('rxjs/operators');

router.get('/:lang', (req, res, next) => {
  const sub = zip(
    CafeHelper.getCafesInCountry('USA').pipe(map(result => ['cafes', result.items])),
    ArticleHelper.getAllArticles(req.params.lang).pipe(map(result => ['articles', result.items]))
  ).subscribe(result => {
    sub.unsubscribe();
    res.render('index', {
      'articleList': result.filter(arr => arr[0] == 'articles')[0][1],
      'cafeList': result.filter(arr => arr[0] == 'cafes')[0][1]
    }, (err, html) => {
      if (err) {
        next(err);
      }
      else {
        res.send(html);
        res.end();
      }
    });
  });
});

module.exports = router;