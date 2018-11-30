const deliveryClient = require('../delivery');
const { Observable } = require('rxjs');

/**
 * Returns a repository for requesting cafes from Kentico Cloud
 * @returns {CafeRepository} a CafeRepository object
 */
function CafeRepository() {

    if (!(this instanceof CafeRepository)) return new CafeRepository();
    this.name = "CafeRepository";
    this.items = void 0;

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

        const obs = deliveryClient.items()
        .type('cafe')
        .getObservable();

        obs.subscribe(response => {
            this.items = response.items;
        });

        return obs;
    }

    this.getCafesInCountry = function(country) {
        return this.items.filter((cafe) => cafe.country.value == country);
    }

    this.getCafesNotInCountry = function(country) {
        return this.items.filter((cafe) => cafe.country.value != country)
    }

}

module.exports = CafeRepository;