const deliveryClient = require('../delivery');
const { map } = require('rxjs/operators');

class CafeHelper {

    static getCafesInCountry(country) {
        return deliveryClient.items()
            .type('cafe')
            .equalsFilter('elements.country', country)
            .toObservable();
    }

    static getCafesNotInCountry(country) {
        return deliveryClient.items()
            .type('cafe')
            .toObservable()
            .pipe(map(result => result.items.filter((cafe) => cafe.country.value != country)));
    }
}

module.exports = CafeHelper;