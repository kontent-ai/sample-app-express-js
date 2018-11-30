const RepositoryBase = require("./repository-base");
const deliveryClient = require('../delivery');

class StoreRepository extends RepositoryBase {

    constructor(){
        super("StoreRepository");
        this.priceRanges = [
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

    ensureItems() {
        if(this.productStatuses) {
            return super.createDummyObservable();
        }

        const obs = deliveryClient.taxonomy('product_status').getObservable();

        obs.subscribe(response => {
            this.productStatuses = response.taxonomy.terms;
        });

        return obs;
    }

    getAllProductStatuses() {
        return this.productStatuses;
    }

    containsPriceRanges(keys) {
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

    containsStatuses(keys) {
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

    filterProductsByPrice(products, keys) {
        const result = [];

        products.forEach(prod => {
            let match = false;

            for(let key = 0; key < keys.length; key += 1) {
                if(!match) {
                    //Find range in array that matches id in keys
                    const range = this.priceRanges.find(rng => rng.id === keys[key]);

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

    static filterProductsByStatus(products, keys) {
        const result = [];

        products.forEach(prod => {
            let match = false;
            const statuses = prod.product_status.value.map((status) => status.codename);
            
            for(let key = 0; key < keys.length; key += 1) {
                if(!match) {
                    for(let stat = 0; stat < statuses.length; stat += 1) {
                        if(statuses[stat] == keys[key]) {
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