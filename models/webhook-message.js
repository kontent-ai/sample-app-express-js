const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');

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
        const computedSignature = crypto.createHmac('sha256', process.env.webhookSecret)
            .update(this.body)
            .digest();
        return crypto.timingSafeEqual(Buffer.from(this.signature, 'base64'), computedSignature);
    }
}

module.exports = WebHookMessage