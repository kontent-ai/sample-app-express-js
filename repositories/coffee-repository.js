const RepositoryBase = require("./repository-base");
const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');
const StoreRepository = require("./store-repository");
const app = require("../app");

class CoffeeRepository extends RepositoryBase {

    constructor() {
        super("CoffeeRepository");
    }

    ensureItems() {
        if(this.items && this.processings) {
            return RepositoryBase.createDummyObservable();
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

    containsProcessings(keys) {
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

    getAllProcessings() {
        return this.processings;
    }

    getCoffee(codename) {
        return this.items.find(coffee => coffee.system.codename === codename);
    }

    getAllCoffees(params) {
        let filteredItems = this.items;

        if(params){
            //Convert object into list of keys
            const keys = Object.keys(params);

            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");

                if(this.containsProcessings(keys)) filteredItems = CoffeeRepository.filterCoffeesByProcessing(filteredItems, keys);
                if(storeRepo.containsStatuses(keys)) filteredItems = StoreRepository.filterProductsByStatus(filteredItems, keys);
            }
        }
        
        return filteredItems;
    }

    static filterCoffeesByProcessing(coffees, keys) {
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
}

module.exports = CoffeeRepository;