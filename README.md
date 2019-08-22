[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-cloud)

# cloud-expressjs-app
This is an Express JS application meant for use with the Dancing Goat sample project within Kentico Cloud. This fully featured project contains marketing content for Dancing Goat – an imaginary chain of coffee shops. If you don't have your own Sample Project, any admin of a Kentico Cloud subscription [can generate one](https://app.kenticocloud.com/sample-project-generator).

You can read more about our [JavaScript SDKs](https://github.com/Kentico/kentico-cloud-js)


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

### Algolia Search Integration

You can test [Algolia](https://www.algolia.com) search functionality on the project's Article content types. Register for an account on Algolia and copy the **App ID** and **Admin API key** from the **API Keys** tab and set the variables in `.env`. Also create an `indexName` with any name you'd like:

```
algoliaKey=<key>
algoliaApp=<app name>
indexName=dancing_goat
```

The application will automatically create, configure, and populate a search index when you visit the **/algolia** route. It will redirect you to the home page when finished, and you should immediately be able to search for articles using the search bar.

To check out the code used to create the index, see [app.js](https://github.com/Kentico/cloud-sample-app-express/blob/master/app.js#L51):

```js
//generate Algolia index
app.use('/:lang/algolia', function (req, res, next) {
  let client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
  let index = client.initIndex(process.env.indexName);
  //etc...
```

To view the search functionality, see [/routes/search.js](/routes/search.js).

### Automatic content translation

There is a `/webhook` route that you can use with [workflow webhooks](https://docs.kenticocloud.com/tutorials/develop-apps/integrate/using-webhooks-for-automatic-updates) to automatically submit an English language variant to [Microsoft's Translator Text Cognitive Service](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-info-overview), translate the variant into other supported languages, and create new language variants in Kentico Cloud.

At the moment, this integration only works if you are using 4-letter language code names in Kentico Cloud (e.g. "es-es"). The application's supported languages can be modified in [app.js](https://github.com/Kentico/cloud-sample-app-express/blob/master/app.js#L9):

```js
const supportedLangs = ['en-us', 'es-es'];
const languageNames = ['English', 'Spanish'];
```

First, you need to [create an Azure Cognitive Services account](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account) for the Translator Text service. Then, add `Key 1` from the **Keys** tab to `.env`:

```
translationKey=<key>
```

If you are running the project locally, you can still test webhooks using [ngrok](https://ngrok.com/) (or a similar program). To use ngrok, follow their [setup guide](https://dashboard.ngrok.com/get-started) and in **step 4** use the port number the Express application will run on (3000 by default). When you're done running ngrok, you should see something like the following:

![ngrok](/ngrok-sample.png)

Copy the URL from the **Forwarding** section and paste it into a new Kentico Cloud webhook's **URL address** with the /webhook path appended:

![webhook](/webhook.png)

While you're there, add a workflow step to **Workflow steps of content items to watch** and remove any other events. This is the workflow step that will trigger the webhook, once any language variant is placed in that step.

Also, copy the **Secret** and add it to `.env`, then grab the Content Management API key from the **API keys** tab:

```
contentManagementKey=<CM API key>
webhookSecret=<secret>
```

Run your Express application, then move an English language variant into the workflow step you selected in the webhook. You should see some debugging information in the console when the webhook is consumed, then you will find your new language variants in the **Draft** step!

### Documentation

Read full documentation and code samples for the [JavaScript Delivery SDK](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md).

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/cloud-sample-app-express/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/cloud-sample-app-express/blob/master/README.md?pixel)
