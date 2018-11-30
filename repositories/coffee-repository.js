const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');

/**
 * Returns a repository for requesting coffees from Kentico Cloud
 * @returns {CoffeeRepository} a CoffeeRepository object
 */
function CoffeeRepository() {

    if (!(this instanceof CoffeeRepository)) return new CoffeeRepository();
    this.name = "CoffeeRepository";
    this.items = void 0;
    this.processings = void 0;

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

        const final = Observable.create(observer => {

            const obs2 = defer(function() {
                return deliveryClient.items()
                .type('coffee')
                .getObservable();
            });

            const obs1 = defer(function(){
                return deliveryClient.taxonomy('processing')
                .getObservable();
            });

            //Get processings
            obs1.subscribe(res1 => {
                this.processings = res1.taxonomy.terms;
                //Now get items
                obs2.subscribe(res2 => {
                    this.items = res2.items;
                    //Finish this observable
                    observer.next(42);
                    observer.complete();
                })
            });
        });

        return final;
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
        return this.items.find(coffee => coffee.system.codename === codename);
    }

    this.getAllCoffees = function(params) {
        let filteredItems = this.items;

        if(params){
            //Convert object into list of keys
            const keys = Object.keys(params);

            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");//eslint-disable-line

                if(this.containsProcessings(keys)) filteredItems = this.filterCoffeesByProcessing(filteredItems, keys);
                if(storeRepo.containsStatuses(keys)) filteredItems = storeRepo.filterProductsByStatus(filteredItems, keys);
            }
        }
        
        return filteredItems;
    }

    this.filterCoffeesByProcessing = function(coffees, keys) {
        const result = [];

        coffees.forEach(coffee => {
            let match = false;

            for(let key = 0; key < keys.length; key += 1) {
                if(!match) {
                    for(let proc = 0; proc < coffee.processing.value.length; proc += 1) {
                        if(coffee.processing.value[proc].codename == keys[key]) {
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