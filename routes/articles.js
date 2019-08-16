const express = require('express');
const router = express.Router();
const ArticleHelper = require('../helpers/article-helper');

router.get('/:lang/articles', (req, res, next) => {
    const sub = ArticleHelper.getAllArticles(req.params.lang).subscribe(result => {
        sub.unsubscribe();
        res.render('articles', { 'articleList': result.items }, (err, html) => {
            if (err) {
                next(err);
            }
            res.send(html);
            res.end();
        });
    });
});

router.get('/:lang/articles/:id', (req, res, next) => {
    const sub = ArticleHelper.getArticle(req.params.id, req.params.lang).subscribe(result => {
        sub.unsubscribe();
        res.render('articles', { 'articleList': result.items }, (err, html) => {
            if (err) {
                next(err);
            }
            res.send(html);
            res.end();
        });
    });
});

module.exports = router;