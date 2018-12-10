const RepositoryBase = require("./repository-base");
const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');
const StoreRepository = require("./store-repository");
const app = require("../app");

class BrewerRepository extends RepositoryBase {

    constructor() {
        super("BrewerRepository");
    }

    ensureItems() {
        if(this.items && this.manufacturers) {
            return RepositoryBase.createDummyObservable();
        }

        const obs2 = defer(function(){
            return deliveryClient.items()
            .type('brewer')
            .getObservable();
        });
        const obs1 = defer(function(){
            return deliveryClient.taxonomy('manufacturer')
            .getObservable();
        });
        const final = Observable.create(observer => {
            //Get manufacturers
            obs1.subscribe(res1 => {
                this.manufacturers = res1.taxonomy.terms;
                //Now get items
                obs2.subscribe(res2 => {
                    this.items = res2.items;
                    //Finish this observable
                    observer.next(42);
                    observer.complete();
                });
            });
        });

        return final;
    }

    containsManufacturers(keys) {
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

    getBrewer(codename) {
        return this.items.find(brewer => brewer.system.codename === codename);
    }

    getAllManufacturers() {
        return this.manufacturers;
    }

    getAllBrewers(params) {
        let filteredList = this.items;

        if(params) {
            //Convert object into list of keys
            const keys = Object.keys(params);

            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");

                if(this.containsManufacturers(keys)) filteredList = BrewerRepository.filterBrewersByManufacturer(filteredList, keys);
                if(storeRepo.containsStatuses(keys)) filteredList = StoreRepository.filterProductsByStatus(filteredList, keys);
                if(storeRepo.containsPriceRanges(keys)) filteredList = storeRepo.filterProductsByPrice(filteredList, keys);
            }
        }
        
        return filteredList;
    }

    static filterBrewersByManufacturer(brewers, keys) {
        const result = [];

        brewers.forEach(brewer => {
            let match = false;

            for(let key = 0; key < keys.length; key += 1) {
                if(!match) {
                    for(let manu = 0; manu < brewer.manufacturer.value.length; manu += 1) {
                        if(brewer.manufacturer.value[manu].codename == keys[key]) {
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