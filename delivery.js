const KenticoCloud = require('kentico-cloud-delivery-typescript-sdk');

const projectId = '0a5a919e-4744-00a1-c6dc-59051776a36e';
const previewApiKey = "";

module.exports = new KenticoCloud.DeliveryClient({
  projectId: projectId,
  typeResolvers: [

  ]
});