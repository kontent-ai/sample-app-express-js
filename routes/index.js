const express = require('express');
const router = express.Router();
let articleRepo, cafeRepo, articleData, cafeData;

//eslint-disable-next-line no-unused-vars
const ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line no-undef
  cafeData = cafeRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line no-unused-vars
const ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line no-undef
  articleData = articleRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line no-unused-vars
const render = function(req, res) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  }, (err, html) => { //eslint-disable-line handle-callback-err
    if(cafeData) cafeData.unsubscribe();
    if(articleData) articleData.unsubscribe();
    res.send(html);
    res.end();
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;