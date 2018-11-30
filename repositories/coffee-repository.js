const deliveryClient = require('../delivery');
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
            let final = Observable.create(observer => {

                let obs2 = defer(function() {
                    return deliveryClient.items()
                    .type('coffee')
                    .getObservable();
                });

                let obs1 = defer(function(){
                    return deliveryClient.taxonomy('processing')
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
        let result = false;
        const processings = this.getAllProcessings();
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
        let items = this.items;

        if(params){
            // Convert object into list of keys
            const keys = Object.keys(params);
            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");
                if(this.containsProcessings(keys)) items = this.filterCoffeesByProcessing(items, keys);
                if(storeRepo.containsStatuses(keys)) items = storeRepo.filterProductsByStatus(items, keys);
            }
        }
        
        return items;
    }

    this.filterCoffeesByProcessing = function(coffees, keys) {
        let result = [];
        coffees.forEach(coffee => {
            let match = false;
            for(let k=0; k<keys.length; k++) {
                if(!match) {
                    for(let p=0; p<coffee.processing.value.length; p++) {
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