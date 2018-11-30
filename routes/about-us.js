const deliveryClient = require('../delivery');
const linkResolver = require('../resolvers/link-resolver');
const express = require('express');
const router = express.Router();

//eslint-disable-next-line
router.get('/about-us', function(req, res, next){
    //Get about-us
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