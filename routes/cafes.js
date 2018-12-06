const express = require('express');
const router = express.Router();
let cafeRepo,
data = void 0;

//eslint-disable-next-line no-unused-vars
const ensureCafes = function(req, res, next) {
    cafeRepo = app.getRepository("CafeRepository");//eslint-disable-line no-undef
    data = cafeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line no-unused-vars
const render = function(req, res, next) {
    res.render('cafes', {
        'partnerCafes': cafeRepo.getCafesNotInCountry('USA'),
        'americanCafes': cafeRepo.getCafesInCountry('USA')
    }, (err, html) => { //eslint-disable-line handle-callback-err
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/cafes', [ensureCafes, render]);

module.exports = router;