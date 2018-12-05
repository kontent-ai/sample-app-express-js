const RepositoryBase = require("./repository-base");
const deliveryClient = require('../delivery');

class ArticleRepository extends RepositoryBase {
    
    constructor() {
        super("ArticleRepository");
    }

    ensureItems() {
        if(this.items) {
            return super.createDummyObservable();
        }

        const obs = deliveryClient.items()
        .type('article')
        .orderParameter('elements.post_date', 1)
        .getObservable();

        obs.subscribe(response => {
            this.items = response.items;
        });
        
        return obs;
    }

    getAllArticles() {
        return this.items;
    }

    getArticle(id) {
        return this.items.filter((article) => article.system.id == id);
    }
}

module.exports = ArticleRepository;