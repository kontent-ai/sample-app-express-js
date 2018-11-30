const express = require('express');
const router = express.Router();
let brewerRepo;

const ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");
    brewerRepo.ensureItems().subscribe(response => {
        next();
    });
}

const render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)});
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;