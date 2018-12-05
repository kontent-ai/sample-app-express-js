const express = require('express');
const router = express.Router();
let articleRepo, cafeRepo, articleData, cafeData;

//eslint-disable-next-line
const ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line
  cafeData = cafeRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line
const ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line
  articleData = articleRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line
const render = function(req, res) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  }, (err, html) => {
    if(cafeData) cafeData.unsubscribe();
    if(articleData) articleData.unsubscribe();
    res.send(html);
    res.end();
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;