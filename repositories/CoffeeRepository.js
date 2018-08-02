var DeliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');


function CoffeeRepository() {

    if (!(this instanceof CoffeeRepository)) return new CoffeeRepository();
    this.name = "CoffeeRepository";
    this.items;
    this.processings;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items && this.processings) {
            return this.createDummyObservable();
        }
        else {
            var final = Observable.create(observer => {

                var obs2 = defer(function() {
                    return DeliveryClient.items()
                    .type('coffee')
                    .getObservable();
                });

                var obs1 = defer(function(){
                    return DeliveryClient.taxonomy('processing')
                    .getObservable();
                });

                // Get processings
                obs1.subscribe(response => {
                    this.processings = response.taxonomy.terms;
                    // Now get items
                    obs2.subscribe(response => {
                        this.items = response.items;
                        // Finish this observable
                        observer.next(42);
                        observer.complete();
                    })
                });
            });

            return final;
        }
    }

    this.containsProcessings = function(keys) {
        var result = false;
        var processings = this.getAllProcessings();
        processings.forEach(proc => {
            if(!result) keys.forEach(key => {
                if(proc.codename == key) {
                    result = true;
                }
            });
        });
        return result;
    }

    this.getAllProcessings = function() {
        return this.processings;
    }

    this.getCoffee = function(codename) {
        return this.items.find(o => o.system.codename === codename);
    }

    this.getAllCoffees = function(params) {
        var items = this.items;

        if(params){
            // Convert object into list of keys
            var keys = Object.keys(params);
            if(keys.length > 0){
                var storeRepo = app.getRepository("StoreRepository");
                if(this.containsProcessings(keys)) items = this.filterCoffeesByProcessing(items, keys);
                if(storeRepo.containsStatuses(keys)) items = storeRepo.filterProductsByStatus(items, keys);
            }
        }
        
        return items;
    }

    this.filterCoffeesByProcessing = function(coffees, keys) {
        var result = [];
        coffees.forEach(coffee => {
            var match = false;
            for(var k=0; k<keys.length; k++) {
                if(!match) {
                    for(var p=0; p<coffee.processing.value.length; p++) {
                        if(coffee.processing.value[p].codename == keys[k]) {
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

    this.GetAllStatuses = function() {
        return this.productStatuses;
    }

}

module.exports = CoffeeRepository;