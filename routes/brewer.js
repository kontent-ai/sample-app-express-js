import { getBrewer } from '../helpers/brewer-helper';
import { Router } from 'express';
const router = Router();

router.get('/:lang/brewer/:codename', (req, res, next) => {
    const sub = getBrewer(req.params.codename, req.params.lang).subscribe(result => {
        sub.unsubscribe();
        res.render('brewer', { 'brewer': result.firstItem }, (err, html) => {
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