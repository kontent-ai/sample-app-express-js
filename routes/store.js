import { Router } from 'express';
const router = Router();
import getAllBrewers from '../helpers/brewer-helper.js';
import getAllCoffees from '../helpers/coffee-helper.js';
import storeHelper from '../helpers/store-helper.js';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

const { getAllProductStatuses, getAllProcessings, getAllManufacturers, applyCoffeeFilters, applyBrewerFilters, PRICE_RANGES } = storeHelper;

const render = function (req, res, next) {
    const type = req.params.type ? req.params.type : 'coffees';
    let obs;

    //Create single observable to obtain all product information
    switch (type) {
        default:
        case 'coffees':
            obs = zip(
                getAllProductStatuses().pipe(map(result => ['statuses', result.taxonomy.terms])),
                getAllCoffees(req.params.lang).pipe(map(result => ['coffees', result.items])),
                getAllProcessings().pipe(map(result => ['processings', result.taxonomy.terms]))
            )
            break;
        case 'brewers':
            obs = zip(
                getAllProductStatuses().pipe(map(result => ['statuses', result.taxonomy.terms])),
                getAllBrewers(req.params.lang).pipe(map(result => ['brewers', result.items])),
                getAllManufacturers().pipe(map(result => ['manufacturers', result.taxonomy.terms]))
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
                coffees = applyCoffeeFilters(coffees, req.query, processings, statuses);
                break;
            case 'brewers':
                [[, manufacturers]] = result.filter(arr => arr[0] == 'manufacturers');
                [[, brewers]] = result.filter(arr => arr[0] == 'brewers');
                brewers = applyBrewerFilters(brewers, req.query, manufacturers, statuses);
                break;
        }

        sub.unsubscribe();
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
    });
}

router.get('/:lang/store', render);
router.get('/:lang/store/:type', render);

export default router;