var express = require('express');
var router = express.Router();
var articleRepo;

var ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");
    articleRepo.ensureItems().subscribe(response => {
        next();
    });
}

var renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()});
}

var renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)});
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;