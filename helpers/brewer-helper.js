import client from '../delivery.js';
import { from } from 'rxjs';

class BrewerHelper {

    static getBrewer(codename, lang) {
        return from(client.items()
            .type('brewer')
            .languageParameter(lang)
            .equalsFilter('system.codename', codename)
            .toPromise());
    }

    static getAllBrewers(lang) {
        return from(client.items()
            .type('brewer')
            .languageParameter(lang)
            .toPromise());
    }

}

export default BrewerHelper;