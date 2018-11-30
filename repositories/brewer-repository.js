const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');

function BrewerRepository() {

    if (!(this instanceof BrewerRepository)) return new BrewerRepository();
    this.name = "BrewerRepository";
    this.items;
    this.manufacturers;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items && this.manufacturers) {
            return this.createDummyObservable();
        }
        else {
            let final = Observable.create(observer => {
                let obs2 = defer(function(){
                    return deliveryClient.items()
                    .type('brewer')
                    .getObservable();
                });
                let obs1 = defer(function(){
                    return deliveryClient.taxonomy('manufacturer')
                    .getObservable();
                });

                // Get manufacturers
                obs1.subscribe(response => {
                    this.manufacturers = response.taxonomy.terms;
                    // Now get items
                    obs2.subscribe(response => {
                        this.items = response.items;
                        // Finish this observable
                        observer.next(42);
                        observer.complete();
                    });
                });
            });

            return final;
        }
    }

    this.containsManufacturers = function(keys) {
        let result = false;
        const manufacturers = this.getAllManufacturers();
        manufacturers.forEach(man => {
            if(!result) keys.forEach(key => {
                if(man.codename == key) {
                    result = true;
                }
            });
        });
        return result;
    }

    this.getBrewer = function(codename) {
        return this.items.find(o => o.system.codename === codename);
    }

    this.getAllManufacturers = function() {
        return this.manufacturers;
    }

    this.getAllBrewers = function(params) {
        let items = this.items;

        if(params) {
            // Convert object into list of keys
            const keys = Object.keys(params);
            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");
                if(this.containsManufacturers(keys)) items = this.filterBrewersByManufacturer(items, keys);
                if(storeRepo.containsStatuses(keys)) items = storeRepo.filterProductsByStatus(items, keys);
                if(storeRepo.containsPriceRanges(keys)) items = storeRepo.filterProductsByPrice(items, keys);
            }
        }
        
        return items;
    }

    this.filterBrewersByManufacturer = function(brewers, keys) {
        let result = [];
        brewers.forEach(brewer => {
            let match = false;
            for(let k=0; k<keys.length; k++) {
                if(!match) {
                    for(let p=0; p<brewer.manufacturer.value.length; p++) {
                        if(brewer.manufacturer.value[p].codename == keys[k]) {
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
}

module.exports = BrewerRepository;