const express = require('express');
const router = express.Router();
let brewerRepo,
data = void 0;

//eslint-disable-next-line no-unused-vars
const ensureBrewers = function(req, res, next) {
    brewerRepo = app.getRepository("BrewerRepository");//eslint-disable-line no-undef
    data = brewerRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line no-unused-vars
const render = function(req, res, next) {
    res.render('brewer', { 'brewer': brewerRepo.getBrewer(req.params.codename)}, (err, html) => { //eslint-disable-line handle-callback-err
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/brewer/:codename', [ensureBrewers, render]);

module.exports = router;