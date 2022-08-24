const { ContentItem } = require('@kontent-ai/delivery-sdk');

class Office extends ContentItem {
    constructor() {
        super({
            propertyResolver: ((fieldName) => {
                if (fieldName === 'zip_code') {
                    return 'zipCode';
                }

                return fieldName;
            })
        });
    }
}
module.exports = Office