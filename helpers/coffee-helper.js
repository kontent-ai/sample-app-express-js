const deliveryClient = require('../delivery');

class CoffeeHelper {

    static getCoffee(codename, lang) {
        return deliveryClient.items()
            .type('coffee')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllCoffees(lang) {
        return deliveryClient.items()
            .type('coffee')
            .languageParameter(lang)
            .toObservable();
    }
}

module.exports = CoffeeHelper;