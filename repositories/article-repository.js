const IRepository = require("./repository-base");
const deliveryClient = require('../delivery');
const hostedVideoResolver = require('../resolvers/hosted-video-resolver');
const tweetResolver = require('../resolvers/tweet-resolver');
const linkResolver = require('../resolvers/link-resolver');

class ArticleRepository extends IRepository {
    
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
        .queryConfig({
            richTextResolver: (item) => {
                if (item.system.type == 'hosted_video') {
                return hostedVideoResolver.resolveModularContent(item);
                }
                else if (item.system.type == 'tweet') {
                return tweetResolver.resolveModularContent(item);
                }

                return "";
            },
            linkResolver: (link) => linkResolver.resolveContentLink(link)
        })
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