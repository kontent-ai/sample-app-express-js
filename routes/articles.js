const express = require('express');
const router = express.Router();
const ArticleHelper = require('../helpers/article-helper');

router.get('/articles', (req, res, next) => {
    const sub = ArticleHelper.getAllArticles().subscribe(result => {
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

router.get('/articles/:id', (req, res, next) => {
    const sub = ArticleHelper.getArticle(req.params.id).subscribe(result => {
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