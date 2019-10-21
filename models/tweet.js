const tweetResolver = require('../resolvers/tweet-resolver');
const { ContentItem } = require('@kentico/kontent-delivery');

class Tweet extends ContentItem {
    constructor() {
        super({
            richTextResolver: ((item) => tweetResolver.resolveModularContent(item)),
            propertyResolver: ((fieldName) => {
                if (fieldName === 'tweet_link') {
                    return 'tweetLink';
                }
                if (fieldName === 'display_options') {
                    return 'displayOptions';
                }

                return fieldName;
            })
        });
    }
}
module.exports = Tweet