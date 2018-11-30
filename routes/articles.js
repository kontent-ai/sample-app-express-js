const express = require('express');
const router = express.Router();
let articleRepo;

//eslint-disable-next-line
const ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line
    articleRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()});
}

//eslint-disable-next-line
const renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)});
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;