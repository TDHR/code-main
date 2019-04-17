const router = require('koa-router')();
const activate = require('../controllers/activate');

router .post('/',activate.index);
router .post('/signMessage',activate.signMessage);//签名接口
router .post('/sendQro',activate.sendQro);

module.exports = router;