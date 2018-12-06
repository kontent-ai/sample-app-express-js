const { ContentItem } = require('kentico-cloud-delivery');

class Cafe extends ContentItem {
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
module.exports = Cafe