import Router from 'koa-router';

let router = new Router();

router
  .get('/', function*() {
    yield this.render('layout', {
      partials: {
        content: 'index',
      },
      title: '包包',
    });
  })
  .get('/pospal', function*() {
    return this.redirect('http://baobaofoods.pospal.cn/m?qrc=' + this.query.addr);
  });

export default router.routes();
