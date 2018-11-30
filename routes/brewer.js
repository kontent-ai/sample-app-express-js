const express = require('express');
const router = express.Router();
let brewerRepo;

//eslint-disable-next-line
const ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");//eslint-disable-line
    brewerRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)});
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;