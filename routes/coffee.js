import { getCoffee } from '../helpers/coffee-helper';
import { Router } from 'express';
const router = Router();

router.get('/:lang/coffee/:codename', (req, res, next) => {
    const sub = getCoffee(req.params.codename, req.params.lang).subscribe(result => {
        sub.unsubscribe();
        res.render('coffee', { 'coffee': result.firstItem }, (err, html) => {
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