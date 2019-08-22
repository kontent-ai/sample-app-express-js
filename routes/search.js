const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = express.Router();
const algoliasearch = require('algoliasearch/lite');

router.get('/:lang/search', (req, res, next) => {
    if(process.env.algoliaApp === undefined || process.env.algoliaKey === undefined || process.env.indexName === undefined) {
        res.send('Algolia search not enabled, please follow the instructions at https://github.com/Kentico/cloud-sample-app-express#algolia-search-integration');
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

module.exports = router;