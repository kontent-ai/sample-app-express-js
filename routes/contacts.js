const express = require('express');
const router = express.Router();
const app = require("../app");
let cafeRepo,
data = void 0;

const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");
    data = cafeRepo.ensureItems().subscribe(() => {
        next();
    });
}

const render = function(req, res, next){
    res.render('contacts', {
        'americanCafes': cafeRepo.getCafesInCountry('USA')
      }, (err, html) => {
        if(err) {
            next(err);
        }
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
      });
}

router.get('/contacts', [ensureCafes, render]);

module.exports = router;