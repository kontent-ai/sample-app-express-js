const express = require('express');
const router = express.Router();
const BrewerHelper = require('../helpers/brewer-helper');
const CoffeeHelper = require('../helpers/coffee-helper');
const StoreHelper = require('../helpers/store-helper');
const { zip } = require('rxjs');
const { map } = require('rxjs/operators');

const render = function (req, res, next) {
    const type = req.params.type ? req.params.type : 'coffees';
    let obs;

    //Create single observable to obtain all product information
    switch (type) {
        default:
        case 'coffees':
            obs = zip(
                StoreHelper.getAllProductStatuses().pipe(map(result => ['statuses', result.taxonomy.terms])),
                CoffeeHelper.getAllCoffees().pipe(map(result => ['coffees', result.items])),
                StoreHelper.getAllProcessings().pipe(map(result => ['processings', result.taxonomy.terms]))
            )
            break;
        case 'brewers':
            obs = zip(
                StoreHelper.getAllProductStatuses().pipe(map(result => ['statuses', result.taxonomy.terms])),
                BrewerHelper.getAllBrewers().pipe(map(result => ['brewers', result.items])),
                StoreHelper.getAllManufacturers().pipe(map(result => ['manufacturers', result.taxonomy.terms]))
            )
            break;
    }

    //Run the obserable
    const sub = obs.subscribe(result => {
        let coffees, processings, manufacturers, brewers;
        const [[, statuses]] = result.filter(arr => arr[0] == 'statuses');

        //Apply selected filters (in query string) to products
        switch (type) {
            default:
            case 'coffees':
                [[, processings]] = result.filter(arr => arr[0] == 'processings');
                [[, coffees]] = result.filter(arr => arr[0] == 'coffees');
                coffees = StoreHelper.applyCoffeeFilters(coffees, req.query, processings, statuses);
                break;
            case 'brewers':
                [[, manufacturers]] = result.filter(arr => arr[0] == 'manufacturers');
                [[, brewers]] = result.filter(arr => arr[0] == 'brewers');
                brewers = StoreHelper.applyBrewerFilters(brewers, req.query, manufacturers, statuses);
                break;
        }

        sub.unsubscribe();
        res.render('store', {
            'type': type,
            //req is needed in Pug to get URL
            'req': req,
            'productStatuses': statuses,
            'priceRanges': StoreHelper.PRICE_RANGES,
            //Coffee items
            'processings': (type == 'coffees') ? processings : [],
            'coffees': (type == 'coffees') ? coffees : [],
            //Brewer items
            'brewers': (type == 'brewers') ? brewers : [],
            'manufacturers': (type == 'brewers') ? manufacturers : [],
        }, (err, html) => {
            if (err) {
                next(err);
            }
            else {
                res.send(html);
                res.end();
            }
        });
    });
}

router.get('/store', render);
router.get('/store/:type', render);

module.exports = router;