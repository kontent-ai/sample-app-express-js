var express = require('express');
var router = express.Router();
var coffeeRepo;

var ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");
    coffeeRepo.ensureItems().subscribe(response => {
        next();
    });
}

var render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)});
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;