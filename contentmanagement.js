import { config } from 'dotenv';
config();
import { ManagementClient } from '@kontent-ai/management-sdk';

export default new ManagementClient({
    projectId: process.env.projectId,
    apiKey: process.env.contentManagementKey
});
