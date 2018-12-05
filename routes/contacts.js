const express = require('express');
const router = express.Router();
let cafeRepo, data;

//eslint-disable-next-line
const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line
    data = cafeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next){
    res.render('contacts', {
        'americanCafes': cafeRepo.getCafesInCountry('USA')
      }, (err, html) => {
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
      });
}

router.get('/contacts', [ensureCafes, render]);

module.exports = router;