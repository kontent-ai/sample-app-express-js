import cafeHelper from '../helpers/cafe-helper.js';
import { Router } from 'express';

const { getCafesNotInCountry, getCafesInCountry } = cafeHelper;
const router = Router();

router.get('/:lang/cafes', async (req, res, next) => {
    const cafes = await Promise.all([getCafesInCountry('USA').then(result => ['usa', result.data.items]).catch(next), getCafesNotInCountry('USA').then(result => ['partners', result]).catch(next)]);

    res.render('cafes', {
        'partnerCafes': cafes.filter(arr => arr[0] == 'partners')[0][1],
        'americanCafes': cafes.filter(arr => arr[0] == 'usa')[0][1]
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

export default router;