const hostedVideoResolver = require('../resolvers/hosted-video-resolver');
const { ContentItem } = require('kentico-cloud-delivery');

class HostedVideo extends ContentItem {
        constructor() {
        super({
            richTextResolver: ((item) => hostedVideoResolver.resolveModularContent(item)),
            propertyResolver: ((fieldName) => {
                if (fieldName === 'video_id') {
                    return 'videoId';
                }
                if (fieldName === 'video_host') {
                    return 'videoHost';
                }
                
                return fieldName;
            })
        });
    }
}
module.exports = HostedVideo