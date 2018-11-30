const RepositoryBase = require("./repository-base");
const deliveryClient = require('../delivery');

class CafeRepository extends RepositoryBase {

    constructor(){
        super("CafeRepository");
    }

    ensureItems() {
        if(this.items) {
            return super.createDummyObservable();
        }

        const obs = deliveryClient.items()
        .type('cafe')
        .getObservable();

        obs.subscribe(response => {
            this.items = response.items;
        });

        return obs;
    }

    getCafesInCountry(country) {
        return this.items.filter((cafe) => cafe.country.value == country);
    }

    getCafesNotInCountry(country) {
        return this.items.filter((cafe) => cafe.country.value != country)
    }
}

module.exports = CafeRepository;