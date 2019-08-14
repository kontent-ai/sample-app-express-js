const deliveryClient = require('../delivery');

class BrewerHelper {

    static getBrewer(codename) {
        return deliveryClient.items()
            .type('brewer')
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllBrewers() {
        return deliveryClient.items()
            .type('brewer')
            .toObservable();
    }

}

module.exports = BrewerHelper;