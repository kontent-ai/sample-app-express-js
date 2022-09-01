import { config } from 'dotenv';
config();
import { createHmac, timingSafeEqual } from 'crypto';

class PushMessage {
    constructor(req) {
        const json = JSON.parse(req.body);

        this.items = json['data']['items'];
        this.webhookType = json['message']['type'];
        this.operation = json['message']['operation'];
        this.body = req.body;
        this.signature = req.headers['x-kc-signature'];
        this.projectId = req.headers['x-kc-message-project-id'];
    }

    hasValidSignature() {
        const computedSignature = createHmac('sha256', process.env.pushSecret)
            .update(this.body)
            .digest();
        return timingSafeEqual(Buffer.from(this.signature, 'base64'), computedSignature);
    }
}

export default PushMessage