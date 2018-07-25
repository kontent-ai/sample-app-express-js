var DeliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');


function CoffeeRepository() {

    if (!(this instanceof CoffeeRepository)) return new CoffeeRepository();
    this.name = "CoffeeRepository";
    this.items;
    this.processings;
    this.productStatuses;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items && this.processings && this.productStatuses) {
            return this.createDummyObservable();
        }
        else {
            var final = Observable.create(observer => {
                var obs3 = defer(function(){
                    return DeliveryClient.taxonomy("product_status")
                    .getObservable();
                });

                var obs2 = defer(function() {
                    return DeliveryClient.items()
                    .type('coffee')
                    .getObservable();
                });

                var obs1 = defer(function(){
                    return DeliveryClient.taxonomy("processing")
                    .getObservable();
                });

                // Get processings
                obs1.subscribe(response => {
                    this.processings = response.taxonomy.terms;
                    // Now get items
                    obs2.subscribe(response => {
                        this.items = response.items;
                        //Now get product statuses
                        obs3.subscribe(response => {
                            this.productStatuses = response.taxonomy.terms;
                            // Finish this observable
                            observer.next(42);
                            observer.complete();
                        });
                    })
                });
            });

            return final;
        }
    }

    this.getAllProcessings = function() {
        return this.processings;
    }

    this.getAllCoffees = function() {
        return this.items;
    }

    this.GetAllStatuses = function() {
        return this.productStatuses;
    }

}

module.exports = CoffeeRepository;