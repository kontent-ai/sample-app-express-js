import { config } from 'dotenv';
import { Router } from 'express';
import algoliasearch from 'algoliasearch/lite.js';
import app from '../app.js';

config();
const router = Router();

router.get('/:lang/search', (req, res, next) => {
    if(process.env.algoliaApp === undefined || process.env.algoliaKey === undefined || process.env.indexName === undefined) {
        res.send('Algolia search not enabled, please follow the instructions at https://github.com/kontent-ai/sample-app-express#algolia-search-integration');
    }
    const client = algoliasearch(process.env.algoliaApp, process.env.algoliaKey);
    const index = client.initIndex(process.env.indexName);
    const term = req.query.searchtext;

    index.search({
            query: term,
            filters: `language:${app.get('currentCulture')}`
        }, (err, { hits } = {}) => {
            if (err) throw err;

            res.render('search', {
                'hits': hits,
                'term': term
                }, (err2, html) => {
                    if (err2) {
                        next(err2);
                    }
                    else {
                        res.send(html);
                        res.end();
                    }
                });
        });
});

export default router;