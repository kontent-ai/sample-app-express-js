const deliveryClient = require('../delivery');

class CoffeeHelper {

    static getCoffee(codename) {
        return deliveryClient.items()
            .type('coffee')
            .equalsFilter('system.codename', codename)
            .getObservable();
    }

    static getAllCoffees() {
        return deliveryClient.items()
            .type('coffee')
            .getObservable();
    }
}

module.exports = CoffeeHelper;