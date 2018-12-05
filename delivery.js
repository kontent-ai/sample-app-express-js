const KenticoCloud = require('kentico-cloud-delivery-typescript-sdk');
const projectId = '2695019d-6404-00c1-fea5-e0f187569329';

module.exports = new KenticoCloud.DeliveryClient({
  projectId: projectId,
  typeResolvers: []
});