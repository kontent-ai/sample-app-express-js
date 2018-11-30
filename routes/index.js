const express = require('express');
const router = express.Router();
let articleRepo;
let cafeRepo;

//eslint-disable-next-line
const ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line
  cafeRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line
const ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line
  articleRepo.ensureItems().subscribe(() => {
      next();
  });
}

//eslint-disable-next-line
const render = function(req, res) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;