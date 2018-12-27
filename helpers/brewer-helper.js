const deliveryClient = require('../delivery');

class BrewerHelper {

    static getBrewer(codename) {
        return deliveryClient.items()
            .type('brewer')
            .equalsFilter('system.codename', codename)
            .getObservable();
    }

    static getAllBrewers() {
        return deliveryClient.items()
            .type('brewer')
            .getObservable();
    }

}

module.exports = BrewerHelper;