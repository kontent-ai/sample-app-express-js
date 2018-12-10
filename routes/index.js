const express = require('express');
const router = express.Router();
const app = require("../app");
let articleRepo, cafeRepo,
articleData = void 0,
cafeData = void 0;

const ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");
  cafeData = cafeRepo.ensureItems().subscribe(() => {
      next();
  });
}

const ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");
  articleData = articleRepo.ensureItems().subscribe(() => {
      next();
  });
}

const render = function(req, res, next) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  }, (err, html) => {
    if(err) {
      next(err);
    }
    if(cafeData !== void 0) cafeData.unsubscribe();
    if(articleData !== void 0) articleData.unsubscribe();
    res.send(html);
    res.end();
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;