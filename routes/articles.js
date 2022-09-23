import { Router } from 'express';
import articleHelper from '../helpers/article-helper.js';
import { resolveRichTextItem } from '../resolvers/rich-text-resolver.js';

const { getAllArticles, getArticle } = articleHelper;
const router = Router();

router.get('/:lang/articles', async (req, res, next) => {
    const response = await getAllArticles(req.params.lang).catch(next);

    res.render('articles', { 'articleList': response.data.items }, (err, html) => {
        if (err) {
            next(err);
        }
        else {
            res.send(html);
            res.end();
        }
    });
});

router.get('/:lang/articles/:id', async (req, res, next) => {
    let resolvedCodenames = [];
    const response = await getArticle(req.params.id, req.params.lang).catch(next);
    resolveRichTextItem(response.data.items[0], resolvedCodenames);

    res.render('articles', { 'articleList': response.data.items }, (err, html) => {
        if (err) {
            next(err);
        }
        else {
            res.send(html);
            res.end();
        }
    });
});

export default router;