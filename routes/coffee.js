const express = require('express');
const router = express.Router();
let coffeeRepo;

const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");
    coffeeRepo.ensureItems().subscribe(response => {
        next();
    });
}

const render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)});
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;