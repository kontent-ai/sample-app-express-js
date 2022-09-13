import client from '../delivery.js';

class CafeHelper {

    static async getCafesInCountry(country) {
        return await client.items()
            .type('cafe')
            .equalsFilter('elements.country', country)
            .toPromise();
    }

    static async getCafesNotInCountry(country) {
        return await client.items()
            .type('cafe')
            .toPromise()
            .then(result => result.data.items.filter((cafe) => cafe.elements.country.value != country));
    }
}

export default CafeHelper;