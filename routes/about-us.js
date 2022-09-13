import client from '../delivery.js';
import { Router } from 'express';
import { resolveRichTextItem } from '../resolvers/rich-text-resolver.js';

const router = Router();

router.get('/:lang/about-us', async (req, res, next) => {
  const response = await client.item('about_us')
    .languageParameter(req.params.lang)
    .depthParameter(2)
    .toPromise()
    .catch(next)

  resolveRichTextItem(response.data.item);

  res.render('about-us', { 'content_item': response.data.item }, (err, html) => {
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