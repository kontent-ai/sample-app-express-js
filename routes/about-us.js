import client from '../delivery.js';
import { resolveContentLink } from '../resolvers/link-resolver.js';
import { Router } from 'express';
import { from } from 'rxjs';
const router = Router();

router.get('/:lang/about-us', (req, res, next) => {
  const sub = from(client.item('about_us')
    .languageParameter(req.params.lang)
    .depthParameter(2)
    .queryConfig({
      linkResolver: (link) => resolveContentLink(link)
    })
    .toPromise())
    .subscribe(result => {
      sub.unsubscribe();
      console.log(result.data.item.elements.facts)
      res.render('about-us', { 'content_item': result.data.item }, (err, html) => {
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

export default router;