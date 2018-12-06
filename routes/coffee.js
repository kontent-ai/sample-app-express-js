const express = require('express');
const router = express.Router();
let coffeeRepo,
data = void 0;

//eslint-disable-next-line no-unused-vars
const ensureCoffees = function(req, res, next) {
    coffeeRepo = app.getRepository("CoffeeRepository");//eslint-disable-line no-undef
    data = coffeeRepo.ensureItems().subscribe(() => {
        next();
    });
}

//eslint-disable-next-line no-unused-vars
const render = function(req, res, next) {
    res.render('coffee', { 'coffee': coffeeRepo.getCoffee(req.params.codename)}, (err, html) => { //eslint-disable-line handle-callback-err
        if(data !== void 0) data.unsubscribe();
        res.send(html);
        res.end();
    });
}

router.get('/coffee/:codename', [ensureCoffees, render]);

module.exports = router;