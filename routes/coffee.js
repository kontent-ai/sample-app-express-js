const express = require('express');
const router = express.Router();
const app = require("../app");
let coffeeRepo,
data = void 0;

const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");
    data = coffeeRepo.ensureItems().subscribe(() => {
        next();
    });
}

const render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)}, (err, html) => {
        if(err) {
            next(err);
        }
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;