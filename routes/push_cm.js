import { config } from 'dotenv';
import PushMessage from '../models/push-message.js';
import webPush from 'web-push';
import AppDAO from '../dao.js';
import client from '../contentmanagement.js';
import { Router } from 'express';

config();
const publicVapidKey = process.env.vapidPublicKey;
const privateVapidKey = process.env.vapidPrivateKey;
const router = Router();

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

const processWebHook = async (message) => {
    const updatedVariantLangID = message.items[0].language.id;
    let updatedVariant;
    const getLanguageVariant = client.viewLanguageVariant()
                .byItemId(message.items[0].item.id)
                .byLanguageId(updatedVariantLangID)
                .toPromise();
    const getContentItem = async result => {
        updatedVariant = result;
        return await client.viewContentItem()
                .byItemId(result.data.item.id)
                .toPromise();
    };
    const getContentType = async result => {
        return await client.viewContentType()
                .byTypeId(result.data.type.id)
                .toPromise()
    };

    const type = (await (getLanguageVariant.then(result => getContentItem(result)).then(result => getContentType(result)))).data;
        if(type.codename === 'push_notification') {
            sendPush(updatedVariant, type);
        }
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
  client.viewAsset().byAssetId(assetID).toPromise().then(result => {
    const payload = JSON.stringify({
      title: variant.data.elements.filter(e => e.element.id === titleID)[0].value,
      body: variant.data.elements.filter(e => e.element.id === bodyID)[0].value,
      icon: result.rawData.url,
      vibrate: (variant.data.elements.filter(e => e.element.id === vibrateID)[0].value.length > 0),
      url: variant.data.elements.filter(e => e.element.id === urlID)[0].value
    });
  
    webPush.setVapidDetails('mailto:address@localhost.local', publicVapidKey, privateVapidKey);
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

        webPush.sendNotification(sub, payload).catch(response => {
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
    
export default router;