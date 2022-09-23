import client from '../delivery.js';

class BrewerHelper {

    static async getBrewer(codename, lang) {
        return await client.items()
            .type('brewer')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toPromise();
    }

    static async getAllBrewers(lang) {
        return await client.items()
            .type('brewer')
            .languageParameter(lang)
            .toPromise();
    }

}

export default BrewerHelper;