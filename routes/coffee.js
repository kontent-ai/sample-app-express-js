const express = require('express');
const router = express.Router();
let coffeeRepo, data;

//eslint-disable-next-line
const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");//eslint-disable-line
    data = coffeeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line
const render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)}, (err, html) => {
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;