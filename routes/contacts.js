const express = require('express');
const router = express.Router();
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAVOq4C-rf7JVeHt6ws9vsf-KHIRpueASg'
});
let cafeRepo;

const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");
    cafeRepo.ensureItems().subscribe(response => {
        next();
    });
}

const render = function(req, res, next){
    res.render('contacts', {
        'americanCafes': cafeRepo.getCafesInCountry('USA')
      });
}

router.get('/contacts', [ensureCafes, render]);

module.exports = router;