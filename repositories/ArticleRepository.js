var DeliveryClient = require('../delivery');
var HostedVideoResolver = require('../resolvers/HostedVideoResolver');
var TweetResolver = require('../resolvers/TweetResolver');
var LinkResolver = require('../resolvers/LinkResolver');
const { Observable, defer } = require('rxjs');

function ArticleRepository() {

    if (!(this instanceof ArticleRepository)) return new ArticleRepository();
    this.name = "ArticleRepository";
    this.items;

    this.createDummyObservable = function() {
        return Observable.create(observer => {
            observer.next(42);
            observer.complete();
        });
    }

    this.ensureItems = function() {
        if(this.items) {
            return this.createDummyObservable();
        }
        else {
            var obs = DeliveryClient.items()
            .type('article')
            .orderParameter('elements.post_date', 1)
            .queryConfig({
                richTextResolver: (item) => {
                  if (item.system.type == 'hosted_video') {
                    return HostedVideoResolver.ResolveModularContent(item);
                  }
                  else if (item.system.type == 'tweet') {
                    return TweetResolver.ResolveModularContent(item);
                  }
                  else return "";
                },
                linkResolver: (link) => LinkResolver.resolveContentLink(link)
            })
            .getObservable();
            obs.subscribe(response => { this.items = response.items; });
            return obs;
        }
    }

    this.getAllArticles = function() {
        return this.items;
    }

    this.getArticle = function(id) {
        return this.items.filter((article) => article.system.id == id);
    }

}

module.exports = ArticleRepository;