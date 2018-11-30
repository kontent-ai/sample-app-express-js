const express = require('express');
const router = express.Router();
let coffeeRepo;

//eslint-disable-next-line
const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");//eslint-disable-line
    coffeeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)});
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;