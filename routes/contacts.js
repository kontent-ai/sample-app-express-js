const express = require('express');
const router = express.Router();
const CafeHelper = require('../helpers/cafe-helper');

router.get('/:lang/contacts', (req, res, next) => {
    const sub = CafeHelper.getCafesInCountry('USA').subscribe(result => {
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

module.exports = router;