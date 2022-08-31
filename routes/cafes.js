import { getCafesNotInCountry, getCafesInCountry } from '../helpers/cafe-helper';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from 'express';
const router = Router();

router.get('/:lang/cafes', (req, res, next) => {
    const sub = zip(
        getCafesNotInCountry('USA').pipe(map(result => ['partners', result])),
        getCafesInCountry('USA').pipe(map(result => ['usa', result.items]))
    ).subscribe(result => {
        sub.unsubscribe();
        res.render('cafes', {
            'partnerCafes': result.filter(arr => arr[0] == 'partners')[0][1],
            'americanCafes': result.filter(arr => arr[0] == 'usa')[0][1]
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