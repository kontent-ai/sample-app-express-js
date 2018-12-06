const express = require('express');
const router = express.Router();
let articleRepo, cafeRepo,
articleData = void 0,
cafeData = void 0;

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
    if(cafeData !== void 0) cafeData.unsubscribe();
    if(articleData !== void 0) articleData.unsubscribe();
    res.send(html);
    res.end();
  });
}

router.get('/', [ensureArticles, ensureCafes, render]);

module.exports = router;