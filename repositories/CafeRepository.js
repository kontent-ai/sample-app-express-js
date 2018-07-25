var DeliveryClient = require('../delivery');
const { Observable, defer } = require('rxjs');

function CafeRepository() {

    if (!(this instanceof CafeRepository)) return new CafeRepository();
    this.name = "CafeRepository";
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
            .type('cafe')
            .getObservable();
            obs.subscribe(response => { this.items = response.items; });
            return obs;
        }
    }

    this.getCafesInCountry = function(country) {
        return this.items.filter((cafe) => cafe.country.value == country);
    }

    this.getCafesNotInCountry = function(country) {
        return this.items.filter((cafe) => cafe.country.value != country)
    }

}

module.exports = CafeRepository;