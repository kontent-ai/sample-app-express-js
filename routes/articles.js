const express = require('express');
const router = express.Router();
let articleRepo, data;

//eslint-disable-next-line
const ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line
    data = articleRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()}, (err, html) =>{
        data.unsubscribe();
        res.send(html);
        res.end();
    });
}

//eslint-disable-next-line
const renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)}, (err, html) =>{
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;