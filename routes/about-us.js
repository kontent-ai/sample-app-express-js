const deliveryClient = require('../delivery');
const linkResolver = require('../resolvers/link-resolver');
const express = require('express');
const router = express.Router();
let data;

//eslint-disable-next-line
router.get('/about-us', function(req, res, next){
    //Get about-us
    data = deliveryClient.item('about_us')
    .queryConfig({
      linkResolver: (link) => linkResolver.resolveContentLink(link)
    })
    .getObservable()
    .subscribe(response => {
      res.render('about-us', { 'content_item': response.item }, (err, html) => {
        if(data) data.unsubscribe();
        res.send(html);
        res.end();
      });
    });
});
  
module.exports = router;