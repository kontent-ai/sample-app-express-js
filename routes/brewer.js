const express = require('express');
const router = express.Router();
const BrewerHelper = require('../helpers/brewer-helper');

router.get('/brewer/:codename', (req, res, next) => {
    const sub = BrewerHelper.getBrewer(req.params.codename).subscribe(result => {
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

module.exports = router;