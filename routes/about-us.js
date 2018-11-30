const deliveryClient = require('../delivery');
const linkResolver = require('../resolvers/link-resolver');
const express = require('express');
const router = express.Router();

router.get('/about-us', function(req, res, next){
    //get about-us
    deliveryClient.item('about_us')
    .queryConfig({
      linkResolver: (link) => linkResolver.resolveContentLink(link)
    })
    .getObservable()
    .subscribe(response => {
      res.render('about-us', { 'content_item': response.item });
    });
});
  
module.exports = router;