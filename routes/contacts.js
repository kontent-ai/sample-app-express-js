var express = require('express');
var router = express.Router();
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAVOq4C-rf7JVeHt6ws9vsf-KHIRpueASg'
});
var cafeRepo;

var ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");
    cafeRepo.ensureItems().subscribe(response => {
        next();
    });
}

var render = function(req, res, next){
    res.render('contacts', {
        'americanCafes': cafeRepo.getCafesInCountry('USA')
      });
}

router.get('/contacts', [ensureCafes, render]);

module.exports = router;