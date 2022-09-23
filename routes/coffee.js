import coffeHelper from '../helpers/coffee-helper.js';
import { Router } from 'express';
import { resolveRichTextItem } from '../resolvers/rich-text-resolver.js'

const { getCoffee } = coffeHelper;
const router = Router();

router.get('/:lang/coffee/:codename', async (req, res, next) => {
    let resolvedCodenames = [];
    const response = await getCoffee(req.params.codename, req.params.lang).catch(next);
    resolveRichTextItem(response.data.items[0], resolvedCodenames);

    res.render('coffee', { 'coffee': response.data.items[0] }, (err, html) => {
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