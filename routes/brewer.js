import brewerHelper from '../helpers/brewer-helper.js';
import { Router } from 'express';

const { getBrewer } = brewerHelper;
const router = Router();

router.get('/:lang/brewer/:codename', async (req, res, next) => {
    const response = await getBrewer(req.params.codename, req.params.lang).catch(next);

    res.render('brewer', { 'brewer': response.data.items[0] }, (err, html) => {
        if (err) {
            next(err);
        }
        else {
            res.send(html);
            res.end();
        }
    });

});

export default router;