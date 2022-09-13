import articleHelper from '../helpers/article-helper.js';
import cafeHelper from '../helpers/cafe-helper.js';
import { Router } from 'express';

const { getCafesInCountry } = cafeHelper;
const { getAllArticles } = articleHelper;
const router = Router();

router.get('/:lang', async (req, res, next) => {
  const results = await Promise.all([getCafesInCountry('USA').then(result => ['cafes', result.data.items]).catch(next), getAllArticles(req.params.lang).then(result => ['articles', result.data.items]).catch(next)]);

  res.render('index', {
    'articleList': results.filter(arr => arr[0] == 'articles')[0][1],
    'cafeList': results.filter(arr => arr[0] == 'cafes')[0][1]
  }, (err, html) => {
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