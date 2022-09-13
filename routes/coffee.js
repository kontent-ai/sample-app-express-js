import coffeHelper from '../helpers/coffee-helper.js';
import { Router } from 'express';

const { getCoffee } = coffeHelper;
const router = Router();

router.get('/:lang/coffee/:codename', async (req, res, next) => {
    const response = await getCoffee(req.params.codename, req.params.lang).catch(next);

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