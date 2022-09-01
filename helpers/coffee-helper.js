import items from '../delivery.js';

class CoffeeHelper {

    static getCoffee(codename, lang) {
        return items()
            .type('coffee')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllCoffees(lang) {
        return items()
            .type('coffee')
            .languageParameter(lang)
            .toObservable();
    }
}

export default CoffeeHelper;