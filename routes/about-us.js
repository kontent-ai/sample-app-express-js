import { item } from '../delivery';
import { resolveContentLink } from '../resolvers/link-resolver';
import { Router } from 'express';
const router = Router();

router.get('/:lang/about-us', (req, res, next) => {
  const sub = item('about_us')
    .languageParameter(req.params.lang)
    .depthParameter(2)
    .queryConfig({
      linkResolver: (link) => resolveContentLink(link)
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

export default router;