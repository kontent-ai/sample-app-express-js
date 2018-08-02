var express = require('express');
var router = express.Router();
var brewerRepo;

var ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");
    brewerRepo.ensureItems().subscribe(response => {
        next();
    });
}

var render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)});
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;