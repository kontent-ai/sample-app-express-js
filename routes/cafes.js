var express = require('express');
var router = express.Router();
var cafeRepo;

var ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");
    cafeRepo.ensureItems().subscribe(response => {
        next();
    });
}

var render = function(req, res, next){
    res.render('cafes', {
        'partnerCafes': cafeRepo.getCafesNotInCountry('USA'),
        'americanCafes': cafeRepo.getCafesInCountry('USA')
    });
}

router.get('/cafes', [ensureCafes, render]);

module.exports = router;