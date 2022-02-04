[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-kontent)

# kontent-sample-app-expressjs
This is an Express JS application meant for use with the Dancing Goat sample project within Kentico Kontent. This fully featured project contains marketing content for Dancing Goat – an imaginary chain of coffee shops. If you don't have your own Sample Project, any admin of a Kontent subscription [can generate one](https://app.kontent.ai/sample-project-generator).

You can read more about our [JavaScript SDKs](https://github.com/Kentico/kontent-delivery-sdk-js)


### Setup

1. Clone the repository
2. Create a `.env` file on the root and set the `projectId` variable to your sample project's Project ID:

```
projectId=<your project ID>
```

3. Run the following commands:

```
npm install
npm start
```

The application will then be available at localhost:3000 (configurable in /bin/www).

:warning: Due to the optional webhook integration, we've hard-coded the language codes available to the application in [app.js](https://github.com/Kentico/kontent-expressjs-app/blob/master/app.js#L12). If necessary, you can update the languages there to match the code names in Kontent:

```js
const supportedLangs = ['en-US', 'es-ES'];
const languageNames = ['English', 'Spanish'];
```

The first language in the list will be used as the default language for the application.

### Algolia Search Integration

You can test [Algolia](https://www.algolia.com) search functionality on the project's Article content types. Register for an account on Algolia and copy the **App ID** and **Admin API key** from the **API Keys** tab and set the variables in `.env`. Also create an `indexName` with any name you'd like:

```
algoliaKey=<key>
algoliaApp=<app name>
indexName=dancing_goat
```

The application will automatically create, configure, and populate a search index when you visit the **/algolia** route. It will redirect you to the home page when finished, and you should immediately be able to search for articles using the search bar.

To check out the code used to create the index, see [app.js](https://github.com/Kentico/kontent-expressjs-app/blob/master/app.js#L61):

```js
//generate Algolia index
app.use('/:lang/algolia', function (req, res, next) {
  let client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
  let index = client.initIndex(process.env.indexName);
  //etc...
```

To view the search functionality, see [/routes/search.js](/routes/search.js).

### Automatic content translation

There is a `/webhook` route that you can use with [workflow webhooks](https://kontent.ai/learn/tutorials/develop-apps/integrate/webhooks) to automatically submit an English language variant to [Microsoft's Translator Text Cognitive Service](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview), translate the variant into other supported languages, and create new language variants in Kontent.

At the moment, this integration only works if you are using 4-letter language code names in Kontent (e.g. "es-es"). The application's supported languages can be modified in [app.js](https://github.com/Kentico/kontent-expressjs-app/blob/master/app.js#L12).

First, you need to [create an Azure Cognitive Services account](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account) for the Translator Text service. Then, add `Key 1` from the **Keys** tab to `.env`:

```
translationKey=<key>
```
Depending on how your translation service is configured in Azure, you may also need to add the service's region to the `.env`, e.g.:

```
translationRegion=westus2
```

If you are running the project locally, you can still test webhooks using [ngrok](https://ngrok.com/) (or a similar program). To use ngrok, follow their [setup guide](https://dashboard.ngrok.com/get-started) and in **step 4** use the port number the Express application will run on (3000 by default). When you're done running ngrok, you should see something like the following:

![ngrok](/assets/ngrok-sample.png)

Copy the URL from the **Forwarding** section and paste it into a new Kontent webhook's **URL address** with the /webhook path appended:

![webhook](/assets/webhook.png)

While you're there, add a workflow step to **Workflow steps of content items to watch** and remove any other events. This is the workflow step that will trigger the webhook, once any language variant is placed in that step.

Also, copy the **Secret** and add it to `.env`, then grab the Content Management API key from the **API keys** tab:

```
contentManagementKey=<CM API key>
webhookSecret=<secret>
```

Run your Express application, then move an English language variant into the workflow step you selected in the webhook. You should see some debugging information in the console when the webhook is consumed, then you will find your new language variants in the **Draft** step!

### Sending push notifications

This application can also send push notifications to visitors whenever a content item in Kontent is published. You can read [this blog post](https://kontent.ai/blog/sending-push-notifications-from-kontent) to read more about how it works and how to set it up from scratch.

To start, you need to create a new content type in Kontent with the codename "push_notification" and the following elements:

- __title__: Text
- __body__: Text
- __icon__: Asset
- __vibrate__: Multiple choice (checkbox with single value "Yes")
- __url__: Text

Next, go to the __Project settings > Webhooks__ page in Kontent and create a new webhook. We want to send push notifications whenever an item of our _push_notification_ type is published, so select "Publish" from the __Content item events to watch__ drop-down.

![push webhook](/assets/pushnotifications-webhook.png)

For the __URL address__, use the /push endpoint, e.g. `https://mysite.com/push`. You can also run the project locally as in the [Automatic content translation](https://github.com/Kentico/kontent-sample-app-express-js#automatic-content-translation) section and enter the ngrok URL with /push at the end.

Copy the __Secret__ and add it to `.env` with the "pushSecret" key:

```
pushSecret=<secret>
```

Save the webhook. Open up a __Command prompt__ and install `web-push` then generate VAPID keys for the project:

```
npm i web-push -g
web-push generate-vapid-keys
```

Copy the Public and Private key to the `.env` file:

```
vapidPublicKey=<public key>
vapidPrivateKey=<private key>
```

Also add the Public key to the top of `/public/scripts/client.js`:

```
const publicVapidKey = '<public key>';
```

You're ready to test the notification now! Make sure to access your site via _https_; push notifications will not work over insecure connections. When you access the site, your browser will prompt you to accept notifications from the website. Accept it, and you should see a successful POST to `/subscribe` in the browser's Network tab.

Now that you're subscribed, head over to Kontent and create a new content item using the _push_notification_ content type. When you publish it, the webhook will shortly trigger and a notification will appear on your desktop:

![push demo](/assets/pushnotifications-demo.gif)

### Documentation

Read full documentation and code samples for the [JavaScript Delivery SDK](https://github.com/Kentico/kontent-delivery-sdk-js/#readme).

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/kontent-expressjs-apps/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions, and begin contributing.

