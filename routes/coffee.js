import coffeHelper from '../helpers/coffee-helper.js';
import { Router } from 'express';
const { getCoffee } = coffeHelper;
const router = Router();

router.get('/:lang/coffee/:codename', (req, res, next) => {
    const sub = getCoffee(req.params.codename, req.params.lang).subscribe(result => {
        sub.unsubscribe();
        res.render('coffee', { 'coffee': result.data.items[0] }, (err, html) => {
            if (err) {
                next(err);
            }
            else {
                res.send(html);
                res.end();
            }
        });
    });
});

export default router;