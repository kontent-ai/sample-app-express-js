const KenticoCloud = require('kentico-cloud-delivery-typescript-sdk');

const projectId = '';
const previewApiKey = '';

module.exports = new KenticoCloud.DeliveryClient({
  projectId: projectId,
  typeResolvers: [

  ]
});