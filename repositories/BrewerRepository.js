var DeliveryClient = require('../delivery');
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
            var final = Observable.create(observer => {
                var obs2 = defer(function(){
                    return DeliveryClient.items()
                    .type('brewer')
                    .getObservable();
                });
                var obs1 = defer(function(){
                    return DeliveryClient.taxonomy('manufacturer')
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
        var result = false;
        var manufacturers = this.getAllManufacturers();
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
        var items = this.items;

        if(params) {
            // Convert object into list of keys
            var keys = Object.keys(params);
            if(keys.length > 0){
                var storeRepo = app.getRepository("StoreRepository");
                if(this.containsManufacturers(keys)) items = this.filterBrewersByManufacturer(items, keys);
                if(storeRepo.containsStatuses(keys)) items = storeRepo.filterProductsByStatus(items, keys);
                if(storeRepo.containsPriceRanges(keys)) items = storeRepo.filterProductsByPrice(items, keys);
            }
        }
        
        return items;
    }

    this.filterBrewersByManufacturer = function(brewers, keys) {
        var result = [];
        brewers.forEach(brewer => {
            var match = false;
            for(var k=0; k<keys.length; k++) {
                if(!match) {
                    for(var p=0; p<brewer.manufacturer.value.length; p++) {
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