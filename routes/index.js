import articleHelper from '../helpers/article-helper.js';
import cafeHelper from '../helpers/cafe-helper.js';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from 'express';

const { getCafesInCountry } = cafeHelper;
const { getAllArticles } = articleHelper;
const router = Router();

router.get('/:lang', (req, res, next) => {
  const sub = zip(
    getCafesInCountry('USA').pipe(map(result => ['cafes', result.data.items])),
    getAllArticles(req.params.lang).pipe(map(result => ['articles', result.data.items]))
  ).subscribe(result => {
    sub.unsubscribe();
    res.render('index', {
      'articleList': result.filter(arr => arr[0] == 'articles')[0][1],
      'cafeList': result.filter(arr => arr[0] == 'cafes')[0][1]
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
});

export default router;