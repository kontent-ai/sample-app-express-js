import { config } from 'dotenv';
import delivery from '@kontent-ai/delivery-sdk';

const { DeliveryClient, TypeResolver } = delivery;
config();

export default new DeliveryClient({
  projectId: process.env.projectId,
  typeResolvers: typeResolvers
});