const { Observable } = require('rxjs');

class RepositoryBase {

    constructor(name) {
        this.name = name;
    }

    static createDummyObservable() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }
}
module.exports = RepositoryBase;