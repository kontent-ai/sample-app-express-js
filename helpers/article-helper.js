const deliveryClient = require('../delivery');

class ArticleHelper {

    static getAllArticles(lang = '', force = false) {
        const query = deliveryClient.items()
            .type('article')
            .orderParameter('elements.post_date', 1);

        if(lang !== '') query.languageParameter(lang);
        if(force) query.equalsFilter('system.language', lang);

        return query.toObservable();
    }

    static getArticle(id, lang) {
        return deliveryClient.items()
            .type('article')
            .languageParameter(lang)
            .equalsFilter('system.id', id)
            .toObservable();
    }
}

module.exports = ArticleHelper;