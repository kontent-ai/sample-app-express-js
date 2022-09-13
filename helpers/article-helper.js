import client from '../delivery.js';

class ArticleHelper {

    static async getAllArticles(lang = '', force = false) {
        const query = client.items()
            .type('article')
            .orderParameter('elements.post_date', 'asc');

        if(lang !== '') query.languageParameter(lang);
        if(force) query.equalsFilter('system.language', lang);

        return await query.toPromise();
    }

    static async getArticle(id, lang) {
        return await client.items()
            .type('article')
            .languageParameter(lang)
            .equalsFilter('system.id', id)
            .toPromise();
    }
}

export default ArticleHelper;