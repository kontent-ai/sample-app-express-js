import AppDAO from '../dao.js';
import { Router } from 'express';
const router = Router();

router.post('/subscribe', (req, res, next) => {
    let json = JSON.parse(req.body);
    let sub = {
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth
    };

    const dao = new AppDAO();
    dao.ensureTable().then(() => {
        dao.insertSubscription(sub).then((response) => {
            res.status(201).json(response);
        });
    });
});

export default router;