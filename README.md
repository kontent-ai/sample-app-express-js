[![Stack Overflow](https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white)](https://stackoverflow.com/tags/kentico-cloud)

# cloud-expressjs-app
This is an Express JS application meant for use with the Dancing Goat sample project within Kentico Cloud. This fully featured project contains marketing content for Dancing Goat – an imaginary chain of coffee shops. If you don't have your own Sample Project, any admin of a Kentico Cloud subscription [can generate one](https://app.kenticocloud.com/sample-project-generator).

You can read more about our [JavaScript SDKs](https://github.com/Kentico/kentico-cloud-js)


### Setup

1. Clone the repository
2. Open the [config.js](/config.js) file and set the projectId variable to your sample project's Project ID:

```js
module.exports.projectId = ''
```

3. Run the following commands:
```
npm install
npm start
```
The application will then be available at localhost:3000 (configurable in /bin/www).

### Algolia Search Integration

You can test [Algolia](https://www.algolia.com) search functionality on the project's Article content types. Register for an account on Algolia and copy the **App ID** and **Admin API key** from the **API Keys** tab and set the variables in [config.js](/config.js):

```js
module.exports.algoliaKey = ''
module.exports.algoliaApp = ''
```

The application will automatically create, configure, and populate a search index when you visit the **/algolia** route. It will redirect you to the home page when finished, and you should immediately be able to search for articles using the search bar.

To check out the code used to create the index, see [app.js](/app.js):

```js
//generate Algolia index
app.use('/:lang/algolia', function (req, res, next) {
  let client = algoliasearch(config.algoliaApp, config.algoliaKey);
  let index = client.initIndex(config.indexName);
  //etc...
```

To view the search functionality, see [/routes/search.js](/routes/search.js).

### Documentation

Read full documentation and code samples for the [JavaScript Delivery SDK](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md).

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/cloud-sample-app-express/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/cloud-sample-app-express/blob/master/README.md?pixel)
