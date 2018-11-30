const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');

function StoreRepository() {

    if (!(this instanceof StoreRepository)) return new StoreRepository();
    this.name = "StoreRepository";
    this.productStatuses;
    this.priceRanges = [
        { id: 'price-low', min: 0, max: 50, text: '$0.00 - $50.00' },
        { id: 'price-mid', min: 50, max: 250, text: '$50.00 - $250.00' },
        { id: 'price-high', min: 250, max: 5000, text: '$250.00 - $5000.00' },
    ];

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.productStatuses) {
            return this.createDummyObservable();
        }
        else {
            let obs = deliveryClient.taxonomy('product_status').getObservable();
            obs.subscribe(response => { this.productStatuses = response.taxonomy.terms; });
            return obs;
        }
    }

    this.getAllProductStatuses = function() {
        return this.productStatuses;
    }

    this.containsPriceRanges = function(keys) {
        let result = false;
        const ranges = this.priceRanges;
        ranges.forEach(range => {
            if(!result) keys.forEach(key => {
                if(range.id == key) {
                    result = true;
                }
            });
        });

        return result;
    }

    this.containsStatuses = function(keys) {
        let result = false;
        const statuses = this.getAllProductStatuses();
        statuses.forEach(status => {
            if(!result) keys.forEach(key => {
                if(status.codename == key) {
                    result = true;
                }
            });
        });
        return result;
    }

    this.filterProductsByPrice = function(products, keys) {
        let result = [];
        products.forEach(prod => {
            let match = false;
            for(let k=0; k<keys.length; k++) {
                if(!match) {
                    //Find range in array that matches id in keys
                    const range = this.priceRanges.find(o => o.id === keys[k]);
                    if(range) {
                        if(prod.price.value <= range.max && prod.price.value >= range.min) {
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

    this.filterProductsByStatus = function(products, keys) {
        let result = [];

        products.forEach(prod => {
            let match = false;
            const statuses = prod.product_status.value.map((x) => x.codename);
            for(let k=0; k<keys.length; k++) {
                if(!match) {
                    for(let s=0; s<statuses.length; s++) {
                        if(statuses[s] == keys[k]) {
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

module.exports = StoreRepository;