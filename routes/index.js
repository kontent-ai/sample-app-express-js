var express = require('express');
var router = express.Router();
var articleRepo;
var cafeRepo;

var ensureCafes = function(req, res, next) {
  cafeRepo = app.getRepository("CafeRepository");
  cafeRepo.ensureItems().subscribe(response => {
      next();
  });
}

var ensureArticles = function(req, res, next) {
  articleRepo = app.getRepository("ArticleRepository");
  articleRepo.ensureItems().subscribe(response => {
      next();
  });
}

var render = function(req, res) {
  res.render('index', {
    'articleList': articleRepo.getAllArticles(),
    'cafeList': cafeRepo.getCafesInCountry('USA')
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;