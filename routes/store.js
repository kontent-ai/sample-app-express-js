const express = require('express');
const router = express.Router();
let coffeeRepo, brewerRepo, storeRepo;

//eslint-disable-next-line
const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");//eslint-disable-line
    coffeeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const ensureBrewers = function(req, res, next) {
    if(req.params.type == "brewers") {
        brewerRepo = app.getRepository("BrewerRepository");//eslint-disable-line
        brewerRepo.ensureItems().subscribe(() => {
            next();
        });
    }
    else next();
}

//eslint-disable-next-line
const ensureStore = function(req, res, next) {
    storeRepo = app.getRepository("StoreRepository");//eslint-disable-line
    storeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next) {
    const type = req.params.type ? req.params.type : "coffees";

    res.render('store', {
        'type': type,
        //req is needed in Pug to get URL
        'req' : req,
        'productStatuses': storeRepo.getAllProductStatuses(),
        'priceRanges': storeRepo.priceRanges,
        //Coffee items
        'processings': (type == "coffees") ? coffeeRepo.getAllProcessings() : [],
        'coffees': (type == "coffees") ? coffeeRepo.getAllCoffees(req.query) : [],
        //Brewer items
        'brewers': (type == "brewers") ? brewerRepo.getAllBrewers(req.query) : [],
        'manufacturers': (type == "brewers") ? brewerRepo.getAllManufacturers() : [],
    });
}

router.get('/store', [ensureCoffees, ensureStore, render]);
router.get('/store/:type', [ensureCoffees, ensureBrewers, ensureStore, render]);

module.exports = router;