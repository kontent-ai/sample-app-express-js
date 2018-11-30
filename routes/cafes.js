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
    res.render('cafes', {
        'partnerCafes': cafeRepo.getCafesNotInCountry('USA'),
        'americanCafes': cafeRepo.getCafesInCountry('USA')
    });
}

router.get('/cafes', [ensureCafes, render]);

module.exports = router;