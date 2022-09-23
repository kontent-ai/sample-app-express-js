import { Router } from 'express';
import brewerHelper from '../helpers/brewer-helper.js';
import coffeeHelper from '../helpers/coffee-helper.js';
import storeHelper from '../helpers/store-helper.js';

const { getAllBrewers } = brewerHelper;
const { getAllCoffees } = coffeeHelper;
const { getAllProductStatuses, getAllProcessings, getAllManufacturers, applyCoffeeFilters, applyBrewerFilters, PRICE_RANGES } = storeHelper;
const router = Router();

const render = async (req, res, next) => {
    const type = req.params.type ? req.params.type : 'coffees';
    let results;

    //Create single promise to obtain all product information
    switch (type) {
        default:
        case 'coffees':
            results = await Promise.all([
                    getAllProductStatuses().then(result => ['statuses', result.data.taxonomy.terms]).catch(next),
                    getAllCoffees(req.params.lang).then(result => ['coffees', result.data.items]).catch(next),
                    getAllProcessings().then(result => ['processings', result.data.taxonomy.terms]).catch(next)
                ]
            )
            break;
        case 'brewers':
            results = await Promise.all([
                    getAllProductStatuses().then(result => ['statuses', result.data.taxonomy.terms]).catch(next),
                    getAllBrewers(req.params.lang).then(result => ['brewers', result.data.items]).catch(next),
                    getAllManufacturers().then(result => ['manufacturers', result.data.taxonomy.terms]).catch(next)
                ]
            )
            break;
    }

    let coffees, processings, manufacturers, brewers;
    const [[, statuses]] = results.filter(arr => arr[0] == 'statuses');

    //Apply selected filters (in query string) to products
    switch (type) {
        default:
        case 'coffees':
            [[, processings]] = results.filter(arr => arr[0] == 'processings');
            [[, coffees]] = results.filter(arr => arr[0] == 'coffees');
            coffees = applyCoffeeFilters(coffees, req.query, processings, statuses);
            break;
        case 'brewers':
            [[, manufacturers]] = results.filter(arr => arr[0] == 'manufacturers');
            [[, brewers]] = results.filter(arr => arr[0] == 'brewers');
            brewers = applyBrewerFilters(brewers, req.query, manufacturers, statuses);
            break;
    }

    res.render('store', {
        'type': type,
        //req is needed in Pug to get URL
        'req': req,
        'productStatuses': statuses,
        'priceRanges': PRICE_RANGES,
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
}

router.get('/:lang/store', render);
router.get('/:lang/store/:type', render);

export default router;