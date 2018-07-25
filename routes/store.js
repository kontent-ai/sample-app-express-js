var express = require('express');
var router = express.Router();
var coffeeRepo, brewerRepo;

var ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");
    coffeeRepo.ensureItems().subscribe(response => {
        next();
    });
}

var ensureBrewers = function(req, res, next) {
    if(req.params.type == "coffees") next();

    brewerRepo = app.getRepository("BrewerRepository");
    brewerRepo.ensureItems().subscribe(response => {
        next();
    });
}

var render = function(req, res, next) {
    var type = req.params.type ? req.params.type : "coffees";

    res.render('store', {
        'type': type,
        'productStatuses': coffeeRepo.GetAllStatuses(),
        //Coffee items
        'processings': (type == "coffees") ? coffeeRepo.getAllProcessings() : [],
        'coffees': (type == "coffees") ? coffeeRepo.getAllCoffees() : [],
        //Brewer items
        'brewers': (type == "brewers") ? brewerRepo.getAllBrewers() : [],
        'manufacturers': (type == "brewers") ? brewerRepo.getAllManufacturers() : []
    });
}

router.get('/store', [ensureCoffees, render]);
router.get('/store/:type', [ensureCoffees, ensureBrewers, render]);

module.exports = router;