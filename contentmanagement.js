import { config } from 'dotenv';
config();
import { ManagementClient } from '@kentico/kontent-management';

export default new ManagementClient({
    projectId: process.env.projectId,
    apiKey: process.env.contentManagementKey
});