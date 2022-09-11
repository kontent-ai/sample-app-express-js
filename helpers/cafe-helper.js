import client from '../delivery.js';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

class CafeHelper {

    static getCafesInCountry(country) {
        return from(client.items()
            .type('cafe')
            .equalsFilter('elements.country', country)
            .toPromise());
    }

    static getCafesNotInCountry(country) {
        return from(client.items()
            .type('cafe')
            .toPromise())
            .pipe(map(result => result.data.items.filter((cafe) => cafe.elements.country.value != country)));
    }
}

export default CafeHelper;