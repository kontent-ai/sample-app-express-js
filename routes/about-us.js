const deliveryClient = require('../delivery');
const linkResolver = require('../resolvers/link-resolver');
const express = require('express');
const router = express.Router();

router.get('/about-us', (req, res, next) => {
  const sub = deliveryClient.item('about_us')
    .queryConfig({
      linkResolver: (link) => linkResolver.resolveContentLink(link)
    })
    .toObservable()
    .subscribe(result => {
      sub.unsubscribe();
      res.render('about-us', { 'content_item': result.item }, (err, html) => {
        if (err) {
          next(err);
        }
        else {
          res.send(html);
          res.end();
        }
      });
    });
});

module.exports = router;