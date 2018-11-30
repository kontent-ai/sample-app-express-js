const express = require('express');
const router = express.Router();
let cafeRepo;

//eslint-disable-next-line
const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line
    cafeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next){
    res.render('contacts', {
        'americanCafes': cafeRepo.getCafesInCountry('USA')
      });
}

router.get('/contacts', [ensureCafes, render]);

module.exports = router;