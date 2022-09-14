import WebHookMessage from '../models/webhook-message.js';
import  client from '../contentmanagement.js';
import axios from 'axios';
import { config } from 'dotenv';
import { Router } from 'express';
import app from '../app.js';
config();

const router = Router();
const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

router.post('/webhook', (req, res, next) => {
    const message = new WebHookMessage(req);
    if (message.hasValidSignature()) {
        processWebHook(message);
        console.log('Webhook - success');
        res.status(200).send('SUCCESS');
    }
    else {
        console.log('Webhook - invalid signature');
        res.status(403).send('INVALID SIGNATURE');
    }
});

let updatedVariant, contentItem, publishedStepId, draftStepId;

const processWebHook = async (message) => {
    client.listWorkflowSteps().toPromise().then((response) => {
        for (const step of response.data) {
            if (step.name === 'Published') {
                publishedStepId = step.id;
            }
            if (step.name === 'Draft') {
                draftStepId = step.id;
            }
        }
    });
    const updatedVariantLangID = message.items[0].language.id;

    const getLanguageVariant = client.viewLanguageVariant()
        .byItemId(message.items[0].item.id)
        .byLanguageId(updatedVariantLangID)
        .toPromise()
        
    const getContentItem = async (result) => {
        updatedVariant = result;
        return await client.viewContentItem()
            .byItemId(result.data.item.id)
            .toPromise();
    };
    const getContentType = async result => {
        contentItem = result.data;
        return await client.viewContentType()
            .byTypeId(result.data.type.id)
            .toPromise()
    };
    
    const type = (await (getLanguageVariant.then(result => getContentItem(result)).then(result => getContentType(result)))).data;
        if (type.codename === 'article') {
            app.get('supportedLangs').forEach(targetLangCode => {
                if (targetLangCode !== 'en-US') prepareVariant(targetLangCode, updatedVariant, contentItem, type);
            });
        }
};

const prepareVariant = (targetLangCode, updatedVariant, contentItem, type) => {
    //get the IDs of text elements
    const textElementIDs = type.elements.filter(e => e.type === 'text' || e.type === 'rich_text').map(e => e.id);
    const slugElementIds = type.elements.filter(e => e.type === 'url_slug').map(e => e.id);
    const itemsToTranslate = [];

    const headers = {
        'Ocp-Apim-Subscription-Key': process.env.translationKey,
        'Content-type': 'application/json'
    };
    if (process.env.translationRegion) {
        headers['Ocp-Apim-Subscription-Region'] = process.env.translationRegion;
    }

    //copy elements from variant that triggered webhook
    updatedVariant.data.elements.forEach(e => {
        if (textElementIDs.includes(e.element.id)) {
            itemsToTranslate.push(
                axios(endpoint,{
                    method: 'POST',
                    params: {
                        from: 'en-us',
                        to: targetLangCode,
                        textType: 'html'
                    },
                    url: endpoint,

                    headers: headers,
                    data: [{
                        'text': e.value
                    }]
                })
                .then(result => [e.element.id, result.data[0].translations[0].text])
            );
        }
    });
    
    Promise.all(itemsToTranslate).then(result => {

        //set new values- translated elements values are stored in [[]] with id/value pair
        updatedVariant.data.elements.forEach(e => {
            const match = result.filter(arr => arr[0] == e.element.id);
            if (match.length > 0) {
                let text = match[0][1];
                if (match.length > 0) e.value = text.replace(/<br>/g, '<br/>');
            }
        });

        //fix url slug elements
        for (const ele of updatedVariant.data.elements) {
            if (slugElementIds.includes(ele.element.id)) {
                ele['mode'] = ele._raw.mode;
            }
        }

        //check if published, create new version or move to Draft step
        client.viewLanguageVariant()
            .byItemId(contentItem.id)
            .byLanguageCodename(targetLangCode)
            .toPromise()
            .then(result => {
                const variant = result.data;
                if (variant.workflowStep.id === publishedStepId) {
                    client.createNewVersionOfLanguageVariant()
                        .byItemId(contentItem.id)
                        .byLanguageCodename(targetLangCode)
                }
                else if (variant.workflowStep.id !== draftStepId) {
                    client.changeWorkflowStepOfLanguageVariant()
                        .byItemId(contentItem.id)
                        .byLanguageCodename(targetLangCode)
                        .byWorkflowStepId(draftStepId)
                }

                upsertVariant(contentItem.id, targetLangCode, updatedVariant.data.elements);
            })
            .catch(error => {
                if (error.errorCode === 103) {
                    //variant doesn't exist, proceed with upsert
                    upsertVariant(contentItem.id, targetLangCode, updatedVariant.data.elements);
                }
            })
        });
}

const upsertVariant = (itemId, lang, elements) => {
    client.upsertLanguageVariant()
        .byItemId(itemId)
        .byLanguageCodename(lang)
        .withData((builder) => elements)
        .toPromise()
        .then(result => {
            console.log(`language ${result.data.language.id}: ${result.debug.response.status}`);
        });
}

export default router;