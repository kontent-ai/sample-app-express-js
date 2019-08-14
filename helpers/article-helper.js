const deliveryClient = require('../delivery');

class ArticleHelper {

    static getAllArticles() {
        return deliveryClient.items()
            .type('article')
            .orderParameter('elements.post_date', 1)
            .toObservable();
    }

    static getArticle(id) {
        return deliveryClient.items()
            .type('article')
            .equalsFilter('system.id', id)
            .toObservable();
    }
}

module.exports = ArticleHelper;