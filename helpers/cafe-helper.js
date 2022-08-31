import { items } from '../delivery';
import { map } from 'rxjs/operators';

class CafeHelper {

    static getCafesInCountry(country) {
        return items()
            .type('cafe')
            .equalsFilter('elements.country', country)
            .toObservable();
    }

    static getCafesNotInCountry(country) {
        return items()
            .type('cafe')
            .toObservable()
            .pipe(map(result => result.items.filter((cafe) => cafe.country.value != country)));
    }
}

export default CafeHelper;