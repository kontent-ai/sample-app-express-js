const express = require('express');
const router = express.Router();
let brewerRepo, data;

//eslint-disable-next-line
const ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");//eslint-disable-line
    data = brewerRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)}, (err, html) => {
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;