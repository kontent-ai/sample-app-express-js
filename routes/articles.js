import { Router } from 'express';
import { getAllArticles, getArticle } from '../helpers/article-helper';
const router = Router();

router.get('/:lang/articles', (req, res, next) => {
    const sub = getAllArticles(req.params.lang).subscribe(result => {
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
    const sub = getArticle(req.params.id, req.params.lang).subscribe(result => {
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

export default router;