const express = require('express');
const router = express.Router();
let articleRepo, data;

//eslint-disable-next-line no-unused-vars
const ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");//eslint-disable-line no-undef
    data = articleRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line no-unused-vars
const renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()}, (err, html) => { //eslint-disable-line handle-callback-err
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

//eslint-disable-next-line no-unused-vars
const renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)}, (err, html) => { //eslint-disable-line handle-callback-err
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;