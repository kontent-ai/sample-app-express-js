const { ContentItem } = require('kentico-cloud-delivery');

class HeroUnit extends ContentItem {
    constructor() {
        super({
            propertyResolver: ((fieldName) => {
                if (fieldName === 'marketing_message') {
                    return 'marketingMessage';
                }

                return fieldName;
            })
        });
    }
}
module.exports = HeroUnit