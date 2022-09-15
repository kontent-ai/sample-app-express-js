import { config } from 'dotenv';
config();
import { createHmac, timingSafeEqual } from 'crypto';

class WebHookMessage {
    constructor(req) {
        const json = JSON.parse(req.body);

        this.items = json['data']['items'];
        this.projectId = json['message']['project_id'];
        this.webhookType = json['message']['type'];
        this.operation = json['message']['operation'];
        this.body = req.body;
        this.signature = req.headers['x-kc-signature'];
    }

    hasValidSignature() {
        const computedSignature = createHmac('sha256', process.env.webhookSecret)
            .update(this.body)
            .digest();
        return timingSafeEqual(Buffer.from(this.signature, 'base64'), computedSignature);
    }
}

export default WebHookMessage
