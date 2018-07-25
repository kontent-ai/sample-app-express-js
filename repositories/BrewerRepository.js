var DeliveryClient = require('../client');
const { Observable, defer } = require('rxjs');

function BrewerRepository() {

    if (!(this instanceof BrewerRepository)) return new BrewerRepository();
    this.name = "BrewerRepository";
    this.items;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items) {
            return this.createDummyObservable();
        }
        else {
            var obs = DeliveryClient.items()
            .type('brewer')
            .getObservable();
            obs.subscribe(response => { this.items = response.items; });
            return obs;
        }
    }

    this.getAllBrewers = function() {
        return this.items;
    }
}

module.exports = BrewerRepository;