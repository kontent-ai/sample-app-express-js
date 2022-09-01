import items from '../delivery.js';

class BrewerHelper {

    static getBrewer(codename, lang) {
        return items()
            .type('brewer')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toObservable();
    }

    static getAllBrewers(lang) {
        return items()
            .type('brewer')
            .languageParameter(lang)
            .toObservable();
    }

}

export default BrewerHelper;