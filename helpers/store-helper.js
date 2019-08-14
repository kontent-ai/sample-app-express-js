const deliveryClient = require('../delivery');

class StoreHelper {

    static get PRICE_RANGES() {
        return [
            {
                id: 'price-low',
                min: 0,
                max: 50,
                text: '$0.00 - $50.00'
            },
            {
                id: 'price-mid',
                min: 50,
                max: 250,
                text: '$50.00 - $250.00'
            },
            {
                id: 'price-high',
                min: 250,
                max: 5000,
                text: '$250.00 - $5000.00'
            }
        ];
    }

    static getAllProductStatuses() {
        return deliveryClient
            .taxonomy('product_status')
            .toObservable();
    }

    static getAllProcessings() {
        return deliveryClient
            .taxonomy('processing')
            .toObservable();
    }

    static applyCoffeeFilters(items, params, processings, statuses) {
        let filteredItems = items;

        if (params) {
            //Convert object into list of keys
            const keys = Object.keys(params);

            if (keys.length > 0) {
                if (StoreHelper.containsProcessings(keys, processings)) filteredItems = StoreHelper.filterCoffeesByProcessing(filteredItems, keys);
                if (StoreHelper.containsStatuses(keys, statuses)) filteredItems = StoreHelper.filterProductsByStatus(filteredItems, keys);
            }
        }

        return filteredItems;
    }

    static applyBrewerFilters(items, params, manufacturers, statuses) {
        let filteredItems = items;

        if (params) {
            //Convert object into list of keys
            const keys = Object.keys(params);

            if (keys.length > 0) {
                if (StoreHelper.containsManufacturers(keys, manufacturers)) filteredItems = StoreHelper.filterBrewersByManufacturer(filteredItems, keys);
                if (StoreHelper.containsStatuses(keys, statuses)) filteredItems = StoreHelper.filterProductsByStatus(filteredItems, keys);
                if (StoreHelper.containsPriceRanges(keys)) filteredItems = StoreHelper.filterProductsByPrice(filteredItems, keys);
            }
        }

        return filteredItems;
    }

    static filterBrewersByManufacturer(brewers, keys) {
        const result = [];

        brewers.forEach(brewer => {
            let match = false;

            for (let key = 0; key < keys.length; key += 1) {
                if (!match) {
                    for (let manu = 0; manu < brewer.manufacturer.value.length; manu += 1) {
                        if (brewer.manufacturer.value[manu].codename == keys[key]) {
                            match = true;
                            result.push(brewer);
                            break;
                        }
                    }
                }
            }
        });

        return result;
    }

    static containsProcessings(keys, processings) {
        let ret = false;

        processings.forEach(proc => {
            if (!ret) keys.forEach(key => {
                if (proc.codename == key) {
                    ret = true;
                }
            });
        });

        return ret;
    }

    static filterCoffeesByProcessing(coffees, keys) {
        const result = [];

        coffees.forEach(coffee => {
            let match = false;

            for (let key = 0; key < keys.length; key += 1) {
                if (!match) {
                    for (let proc = 0; proc < coffee.processing.value.length; proc += 1) {
                        if (coffee.processing.value[proc].codename == keys[key]) {
                            match = true;
                            result.push(coffee);
                            break;
                        }
                    }
                }
            }
        });

        return result;
    }

    static containsPriceRanges(keys) {
        let result = false;

        StoreHelper.PRICE_RANGES.forEach(range => {
            if (!result) keys.forEach(key => {
                if (range.id == key) {
                    result = true;
                }
            });
        });

        return result;
    }

    static containsStatuses(keys, statuses) {
        let ret = false;

        statuses.forEach(status => {
            if (!ret) keys.forEach(key => {
                if (status.codename == key) {
                    ret = true;
                }
            });
        });

        return ret;
    }

    static filterProductsByPrice(products, keys) {
        const result = [];

        products.forEach(prod => {
            let match = false;

            for (let key = 0; key < keys.length; key += 1) {
                if (!match) {
                    //Find range in array that matches id in keys
                    const range = StoreHelper.PRICE_RANGES.find(rng => rng.id === keys[key]);

                    if (range) {
                        if (prod.price.value <= range.max && prod.price.value >= range.min) {
                            match = true;
                            result.push(prod);
                            break;
                        }
                    }
                }
            }
        });

        return result;
    }

    static containsManufacturers(keys, manufacturers) {
        let ret = false;

        manufacturers.forEach(man => {
            if (!ret) keys.forEach(key => {
                if (man.codename == key) {
                    ret = true;
                }
            });
        });

        return ret;
    }

    static getAllManufacturers() {
        return deliveryClient
            .taxonomy('manufacturer')
            .toObservable();
    }

    static filterProductsByStatus(products, keys) {
        const result = [];

        products.forEach(prod => {
            let match = false;
            const statuses = prod.productStatus.value.map((status) => status.codename);

            for (let key = 0; key < keys.length; key += 1) {
                if (!match) {
                    for (let stat = 0; stat < statuses.length; stat += 1) {
                        if (statuses[stat] == keys[key]) {
                            match = true;
                            result.push(prod);
                            break;
                        }
                    }
                }
            }
        });

        return result;
    }
}

module.exports = StoreHelper;