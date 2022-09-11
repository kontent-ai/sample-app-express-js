import client from '../delivery.js';
import { from } from 'rxjs';

class CoffeeHelper {

    static getCoffee(codename, lang) {
        return from(client.items()
            .type('coffee')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toPromise());
    }

    static getAllCoffees(lang) {
        return from(client.items()
            .type('coffee')
            .languageParameter(lang)
            .toPromise());
    }
}

export default CoffeeHelper;