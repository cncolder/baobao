import Router from 'koa-router';

let router = new Router();

router
  .get('/pospal', function*() {
    let url = [
      'http://',
      this.query.shop,
      '.pospal.cn/m?qrc=',
      this.query.addr,
    ].join('');

    return this.redirect(url);
  });

export default router.routes();
