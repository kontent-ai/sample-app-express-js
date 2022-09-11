import client from '../delivery.js';
import { from } from 'rxjs';

class ArticleHelper {

    static getAllArticles(lang = '', force = false) {
        const query = client.items()
            .type('article')
            .orderParameter('elements.post_date', 'asc');

        if(lang !== '') query.languageParameter(lang);
        if(force) query.equalsFilter('system.language', lang);

        return from(query.toPromise());
    }

    static getArticle(id, lang) {
        return from(client.items()
            .type('article')
            .languageParameter(lang)
            .equalsFilter('system.id', id)
            .toPromise());
    }
}

export default ArticleHelper;