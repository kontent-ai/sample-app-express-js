const dotenv = require('dotenv');
dotenv.config();
const { ContentManagementClient } = require('kentico-cloud-content-management');
module.exports = new ContentManagementClient({
    projectId: process.env.projectId,
    apiKey: process.env.contentManagementKey
});