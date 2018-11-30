const express = require('express');
const router = express.Router();
let articleRepo;
let cafeRepo;

const ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");
  cafeRepo.ensureItems().subscribe(response => {
      next();
  });
}

const ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");
  articleRepo.ensureItems().subscribe(response => {
      next();
  });
}

const render = function(req, res) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;