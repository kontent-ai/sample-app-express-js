const AppDAO = require('../dao');
const express = require('express');
const router = express.Router();

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

module.exports = router;