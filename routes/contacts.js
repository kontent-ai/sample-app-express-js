import getCafesInCountry from '../helpers/cafe-helper.js';
import { Router } from 'express';
const router = Router();

router.get('/:lang/contacts', (req, res, next) => {
    const sub = getCafesInCountry('USA').subscribe(result => {
        sub.unsubscribe();
        res.render('contacts', {
            'americanCafes': result.items
        }, (err, html) => {
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