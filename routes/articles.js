const express = require('express');
const router = express.Router();
let articleRepo;

const ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");
    articleRepo.ensureItems().subscribe(response => {
        next();
    });
}

const renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()});
}

const renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)});
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;