const express = require('express');
const router = express.Router();
const app = require("../app");
let brewerRepo,
data = void 0;

const ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");
    data = brewerRepo.ensureItems().subscribe(() => {
        next();
    });
}

const render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)}, (err, html) => {
        if(err) {
            next(err);
        }
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;