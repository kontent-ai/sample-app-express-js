import { config } from 'dotenv';
config();
import { Router } from 'express';
const router = Router();
import WebHookMessage from '../models/webhook-message';
import { listWorkflowSteps, viewLanguageVariant, viewContentItem, viewContentType, createNewVersionOfLanguageVariant, changeWorkflowStepOfLanguageVariant, upsertLanguageVariant } from '../contentmanagement';
import { Axios } from 'axios-observable';
import { zip, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
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

const processWebHook = (message) => {
    listWorkflowSteps().toObservable().subscribe((response) => {
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

    const getLanguageVariant = viewLanguageVariant()
        .byItemId(message.items[0].item.id)
        .byLanguageId(updatedVariantLangID)
        .toObservable();
    const getContentItem = result => {
        updatedVariant = result;
        return viewContentItem()
            .byItemId(result.data.item.id)
            .toObservable();
    };
    const getContentType = result => {
        contentItem = result.data;
        return viewContentType()
            .byTypeId(result.data.type.id)
            .toObservable()
    };

    const obs = getLanguageVariant.pipe(mergeMap(getContentItem)).pipe(mergeMap(getContentType));
    const sub = obs.subscribe(result => {
        sub.unsubscribe();
        const type = result.data;
        if (type.codename === 'article') {

            app.get('supportedLangs').forEach(targetLangCode => {
                if (targetLangCode !== 'en-US') prepareVariant(targetLangCode, updatedVariant, contentItem, type);
            });
        }
    });
};

const prepareVariant = (targetLangCode, updatedVariant, contentItem, type) => {
    //get the IDs of text elements
    const textElementIDs = type.elements.filter(e => e.type === 'text' || e.type === 'rich_text').map(e => e.id);
    const slugElementIds = type.elements.filter(e => e.type === 'url_slug').map(e => e.id);
    const translateObservables = [];

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
            translateObservables.push(
                Axios.request({
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
                    .pipe(map(result => [e.element.id, result.data[0].translations[0].text]))
            );
        }
    });

    const sub = zip(...translateObservables).subscribe(result => {
        sub.unsubscribe();

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
        const innerSub = viewLanguageVariant()
            .byItemId(contentItem.id)
            .byLanguageCodename(targetLangCode)
            .toObservable()
            .subscribe(result => {
                innerSub.unsubscribe();

                const variant = result.data;
                let obs;
                if (variant.workflowStep.id === publishedStepId) {
                    obs = createNewVersionOfLanguageVariant()
                        .byItemId(contentItem.id)
                        .byLanguageCodename(targetLangCode)
                        .toObservable();
                }
                else if (variant.workflowStep.id !== draftStepId) {
                    obs = changeWorkflowStepOfLanguageVariant()
                        .byItemId(contentItem.id)
                        .byLanguageCodename(targetLangCode)
                        .byWorkflowStepId(draftStepId)
                        .toObservable();
                }
                else {
                    obs = of({});
                }

                //run the upsert after obs completes
                obs.subscribe(result => {
                    upsertVariant(contentItem.id, targetLangCode, updatedVariant.data.elements);
                });
            }, error => {
                if (error.errorCode === 103) {
                    //variant doesn't exist, proceed with upsert
                    upsertVariant(contentItem.id, targetLangCode, updatedVariant.data.elements);
                }
            });
    });
}

const upsertVariant = (itemId, lang, elements) => {
    upsertLanguageVariant()
        .byItemId(itemId)
        .byLanguageCodename(lang)
        .withData((builder) => elements)
        .toObservable()
        .subscribe(result => {
            console.log(`language ${result.data.language.id}: ${result.debug.response.status}`);
        });
}

export default router;