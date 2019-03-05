[![Stack Overflow](https://img.shields.io/stackexchange/stackoverflow/t/kentico%2dcloud.svg?label=Stack%20Overflow)](https://stackoverflow.com/tags/kentico-cloud)
[![Join the chat at https://kentico-community.slack.com](https://img.shields.io/badge/join-slack-E6186D.svg)](https://kentico-community.slack.com)

# cloud-expressjs-app
This is an Express JS application meant for use with the Dancing Goat sample project within Kentico Cloud. This fully featured project contains marketing content for Dancing Goat – an imaginary chain of coffee shops. If you don't have your own Sample Project, any admin of a Kentico Cloud subscription [can generate one](https://app.kenticocloud.com/sample-project-generator).

You can read more about our [JavaScript SDKs](https://github.com/Kentico/kentico-cloud-js)


### Setup

1. Clone the repository
2. Open the **delivery.js** file and set the projectID variable to your sample project's Project ID:
```
const projectId = '<your-project-id-here>';
```
3. Run the following commands:
```
npm install
npm start
```
The application will then be available at localhost:3000 (configurable in /bin/www).

### Documentation

Read full documentation and code samples for the [JavaScript Delivery SDK](https://github.com/Kentico/kentico-cloud-js/blob/master/doc/delivery.md).

## Feedback & Contributing

Check out the [contributing](https://github.com/Kentico/cloud-sample-app-express/blob/master/CONTRIBUTING.md) page to see the best places to file issues, start discussions, and begin contributing.

![Analytics](https://kentico-ga-beacon.azurewebsites.net/api/UA-69014260-4/Kentico/cloud-sample-app-express/blob/master/README.md?pixel)
