import cafeHelper from '../helpers/cafe-helper.js';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from 'express';
const router = Router();
const { getCafesNotInCountry, getCafesInCountry } = cafeHelper;

router.get('/:lang/cafes', (req, res, next) => {
    getCafesInCountry('USA').subscribe(c => console.log(c));
    const sub = zip(
        getCafesNotInCountry('USA').pipe(map(result => ['partners', result])),
        getCafesInCountry('USA').pipe(map(result => ['usa', result.data.items]))
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