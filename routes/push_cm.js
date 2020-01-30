const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const PushMessage = require('../models/push-message');
const webpush = require('web-push');
const AppDAO = require('../dao');
const cmClient = require('../contentmanagement');
const { mergeMap } = require('rxjs/operators');
const publicVapidKey = process.env.vapidPublicKey;
const privateVapidKey = process.env.vapidPrivateKey;

router.post('/push_cm', (req, res) => {
  const message = new PushMessage(req);
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

const processWebHook = (message) => {
    const updatedVariantLangID = message.items[0].language;
    let updatedVariant;

    const getLanguageVariant = cmClient
                .viewLanguageVariant()
                .byItemId(message.items[0].id)
                .byLanguageCodename(updatedVariantLangID)
                .toObservable();
    const getContentItem = result => {
        updatedVariant = result;
        return cmClient
                .viewContentItem()
                .byItemId(result.data.item.id)
                .toObservable();
    };
    const getContentType = result => {
        return cmClient
                .viewContentType()
                .byTypeId(result.data.type.id)
                .toObservable()
    };

    const obs = getLanguageVariant.pipe(mergeMap(getContentItem)).pipe(mergeMap(getContentType));
    const sub = obs.subscribe(result => {
        sub.unsubscribe();
        const type = result.data;
        if(type.codename === 'push_notification') {
            sendPush(updatedVariant, type);
        }
    });
};


const sendPush = function(variant, type) {
  //Get the GUIDs of each element to locate them in the variant
  const titleID = type.elements.filter(e => e.codename === 'title').map(e => e.id)[0],
  bodyID = type.elements.filter(e => e.codename === 'body').map(e => e.id)[0],
  iconID = type.elements.filter(e => e.codename === 'icon').map(e => e.id)[0],
  vibrateID = type.elements.filter(e => e.codename === 'vibrate').map(e => e.id)[0],
  urlID = type.elements.filter(e => e.codename === 'url').map(e => e.id)[0],
  assetID = variant.data.elements.filter(e => e.element.id === iconID)[0].value[0].id;

  //Get asset URL
  cmClient.viewAsset().byAssetId(assetID).toObservable().subscribe(result => {
    const payload = JSON.stringify({
      title: variant.data.elements.filter(e => e.element.id === titleID)[0].value,
      body: variant.data.elements.filter(e => e.element.id === bodyID)[0].value,
      icon: result.rawData.url,
      vibrate: (variant.data.elements.filter(e => e.element.id === vibrateID)[0].value.length > 0),
      url: variant.data.elements.filter(e => e.element.id === urlID)[0].value
    });
  
    webpush.setVapidDetails('mailto:support@kentico.com', publicVapidKey, privateVapidKey);
    const dao = new AppDAO();
    dao.getAllSubscriptions().then((rows) => {
  
      rows.forEach((row) => {
        //Row contains sub data in flat structure, but webpush expects {endpoint,keys{auth,p256dh}}
        let sub = {
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          }
        };

        webpush.sendNotification(sub, payload).catch(response => {
          if(response.statusCode === 410) {
            //Subscription expired or removed- delete from db
            dao.deleteSubscription(sub);
            console.log(`Subscription ${sub.keys.p256dh} deleted`);
          }
        });
      });
    });
  })
}
    
module.exports = router;