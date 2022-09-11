import { config } from 'dotenv';
import delivery, { camelCasePropertyNameResolver } from '@kontent-ai/delivery-sdk';

const { DeliveryClient } = delivery;
config();

export default new DeliveryClient({
  projectId: process.env.projectId,
  propertyNameResolver: camelCasePropertyNameResolver
});