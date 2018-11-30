const express = require('express');
const router = express.Router();
let cafeRepo;

const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");
    cafeRepo.ensureItems().subscribe(response => {
        next();
    });
}

const render = function(req, res, next){
    res.render('cafes', {
        'partnerCafes': cafeRepo.getCafesNotInCountry('USA'),
        'americanCafes': cafeRepo.getCafesInCountry('USA')
    });
}

router.get('/cafes', [ensureCafes, render]);

module.exports = router;