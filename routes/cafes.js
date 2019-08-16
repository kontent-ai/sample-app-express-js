const express = require('express');
const router = express.Router();
const CafeHelper = require('../helpers/cafe-helper');
const { zip } = require('rxjs');
const { map } = require('rxjs/operators');

router.get('/:lang/cafes', (req, res, next) => {
    const sub = zip(
        CafeHelper.getCafesNotInCountry('USA').pipe(map(result => ['partners', result])),
        CafeHelper.getCafesInCountry('USA').pipe(map(result => ['usa', result.items]))
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

module.exports = router;