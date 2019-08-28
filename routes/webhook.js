const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const WebHookMessage = require('../models/webhook-message');
const cmClient = require('../contentmanagement');
const Axios = require('axios-observable').Axios;
const { zip } = require('rxjs');
const { map } = require('rxjs/operators');
const { mergeMap } = require('rxjs/operators');
const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

router.post('/webhook', (req, res, next) => {
    const message = new WebHookMessage(req);
    if(message.hasValidSignature()) {
        processWebHook(message);
        console.log('Webhook - success');
        res.status(200).send('SUCCESS');
    }
    else {
        console.log('Webhook - invalid signature');
        res.status(403).send('INVALID SIGNATURE');
    }
});

let updatedVariant, contentItem;

const processWebHook = function(message) {
    const updatedVariantLangID = message.items[0].language.id;

    const getLanguageVariant = cmClient
                .viewLanguageVariant()
                .byItemId(message.items[0].item.id)
                .byLanguageId(updatedVariantLangID)
                .toObservable();
    const getContentItem = result => {
        updatedVariant = result;
        return cmClient
                .viewContentItem()
                .byItemId(result.data.item.id)
                .toObservable();
    };
    const getContentType = result => {
        contentItem = result.data;
        return cmClient
                .viewContentType()
                .byTypeId(result.data.type.id)
                .toObservable()
    };

    const obs = getLanguageVariant.pipe(mergeMap(getContentItem)).pipe(mergeMap(getContentType));
    const sub = obs.subscribe(result => {
        sub.unsubscribe();
        const type = result.data;
        if(type.codename === 'article') {

            app.get('supportedLangs').forEach(targetLangCode => {
                if(targetLangCode !== 'en-us') upsertLanguageVariant(targetLangCode, updatedVariant, contentItem, type);
            });
        }
    });
};

const upsertLanguageVariant = function(targetLangCode, updatedVariant, contentItem, type) {
    //get the IDs of text elements
    const textElementIDs = type.elements.filter(e => e.type === 'text' || e.type === 'rich_text').map(e => e.id);
    const translateObservables = [];

    //copy elements from variant that triggered webhook
    updatedVariant.data.elements.forEach(e => {
        if(textElementIDs.includes(e.element.id)) {
            translateObservables.push(
                Axios.request({
                    method: 'POST',
                    params: {
                        from: 'en-us',
                        to: targetLangCode,
                        textType: 'html'
                    },
                    url: endpoint,
                    
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.translationKey,
                        'Content-type': 'application/json'
                    },
                    data: [{
                        'text': e.value
                    }]
                })
                .pipe(map(result => [e.element.id, result.data[0].translations[0].text]))
            );
        }
    });

    const sub = zip(...translateObservables).subscribe(result => {
        sub.unsubscribe();
        
        //set new values- translated elements values are stored in [[]] with id/value pair
        updatedVariant.data.elements.forEach(e => {
            const match = result.filter(arr => arr[0] == e.element.id);
            if(match.length > 0) {
                let text = match[0][1];
                if(match.length > 0) e.value = text.replace(/<br>/g, '<br/>');
            }
        });

        cmClient.upsertLanguageVariant()
            .byItemId(contentItem.id)
            .byLanguageCodename(targetLangCode)
            .withElements(updatedVariant.data.elements)
            .toObservable()
            .subscribe(result => {
                console.log(`language ${result.data.language.id}: ${result.debug.response.status}`);
            });
    });
}

module.exports = router;