import client from '../delivery.js';

class CoffeeHelper {

    static async getCoffee(codename, lang) {
        return await client.items()
            .type('coffee')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toPromise();
    }

    static async getAllCoffees(lang) {
        return await client.items()
            .type('coffee')
            .languageParameter(lang)
            .toPromise();
    }
}

export default CoffeeHelper;