var DeliveryClient = require('../client');
var LinkResolver = require('../resolvers/LinkResolver');
var express = require('express');
var router = express.Router();

router.get('/about-us', function(req, res, next){
    //get about-us
    DeliveryClient.item('about_us')
    .queryConfig({
      linkResolver: (link) => LinkResolver.resolveContentLink(link)
    })
    .getObservable()
    .subscribe(response => {
      res.render('about-us', { 'content_item': response.item });
    });
});
  
module.exports = router;