const deliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');

/**
 * Returns a repository for requesting brewers from Kentico Cloud
 * @returns {BrewerRepository} a BrewerRepository object
 */
function BrewerRepository() {

    if (!(this instanceof BrewerRepository)) return new BrewerRepository();
    this.name = "BrewerRepository";
    this.items = void 0;
    this.manufacturers = void 0;

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

        const final = Observable.create(observer => {
            const obs2 = defer(function(){
                return deliveryClient.items()
                .type('brewer')
                .getObservable();
            });
            const obs1 = defer(function(){
                return deliveryClient.taxonomy('manufacturer')
                .getObservable();
            });

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
        return this.items.find(brewer => brewer.system.codename === codename);
    }

    this.getAllManufacturers = function() {
        return this.manufacturers;
    }

    this.getAllBrewers = function(params) {
        let filteredList = this.items;

        if(params) {
            //Convert object into list of keys
            const keys = Object.keys(params);

            if(keys.length > 0){
                const storeRepo = app.getRepository("StoreRepository");//eslint-disable-line

                if(this.containsManufacturers(keys)) filteredList = this.filterBrewersByManufacturer(filteredList, keys);
                if(storeRepo.containsStatuses(keys)) filteredList = storeRepo.filterProductsByStatus(filteredList, keys);
                if(storeRepo.containsPriceRanges(keys)) filteredList = storeRepo.filterProductsByPrice(filteredList, keys);
            }
        }
        
        return filteredList;
    }

    this.filterBrewersByManufacturer = function(brewers, keys) {
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