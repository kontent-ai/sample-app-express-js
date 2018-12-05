# cloud-expressjs-app
This is an Express JS application meant for use with the Dancing Goat sample project within Kentico Cloud. You can read more about the TypeScript Node.js SDK here: [https://github.com/Enngage/kentico-cloud-js](https://github.com/Enngage/kentico-cloud-js)

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