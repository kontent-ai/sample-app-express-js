const express = require('express');
const router = express.Router();
const CoffeeHelper = require('../helpers/coffee-helper');

router.get('/:lang/coffee/:codename', (req, res, next) => {
    const sub = CoffeeHelper.getCoffee(req.params.codename, req.params.lang).subscribe(result => {
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

module.exports = router;