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
                    return DeliveryClient.taxonomy("manufacturer")
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

    this.getAllManufacturers = function() {
        return this.manufacturers;
    }

    this.getAllBrewers = function() {
        return this.items;
    }
}

module.exports = BrewerRepository;