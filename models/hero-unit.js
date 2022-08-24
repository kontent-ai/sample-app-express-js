const { ContentItem } = require('@kontent-ai/delivery-sdk');

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