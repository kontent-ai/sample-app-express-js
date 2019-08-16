const deliveryClient = require('../delivery');

class BrewerHelper {

    static getBrewer(codename, lang) {
        return deliveryClient.items()
            .type('brewer')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllBrewers(lang) {
        return deliveryClient.items()
            .type('brewer')
            .languageParameter(lang)
            .toObservable();
    }

}

module.exports = BrewerHelper;