const express = require('express');
const router = express.Router();
const app = require("../app");
let articleRepo,
data = void 0;

const ensureArticles = function(req, res, next) {
    articleRepo = app.getRepository("ArticleRepository");
    data = articleRepo.ensureItems().subscribe(() => {
        next();
    });
}

const renderListing = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getAllArticles()}, (err, html) => {
        if(err) {
            next(err);
        }
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

const renderSingle = function(req, res, next) {
    res.render('articles', {'articleList': articleRepo.getArticle(req.params.id)}, (err, html) => {
        if(err) {
            next(err);
          }
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/articles', [ensureArticles, renderListing]);
router.get('/articles/:id', [ensureArticles, renderSingle]);

module.exports = router;