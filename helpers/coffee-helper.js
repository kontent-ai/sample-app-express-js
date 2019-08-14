const deliveryClient = require('../delivery');

class CoffeeHelper {

    static getCoffee(codename) {
        return deliveryClient.items()
            .type('coffee')
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllCoffees() {
        return deliveryClient.items()
            .type('coffee')
            .toObservable();
    }
}

module.exports = CoffeeHelper;