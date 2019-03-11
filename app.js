const Koa = require('koa');
const request = require('superagent');
const view = require('koa-views');
const routers = require('./server/router/index');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const ora = require('ora');
// const spinner = ora('Loading unicorns').start();
const myCipher = require('./util/cipher');
const myRandom = require('./util/myRandom');
const scheduleProject = require('./config/scheduleProject');
// setTimeout(() => {
//     spinner.color = 'red';
//     spinner.text = 'Loading rainbows';
// },3000);

app.use(bodyParser());
// app.use(async (ctx)=>{
//     ctx.body= inform+ '\n' + address;
//
// })
app.use(view(path.join(__dirname,'./server/views'),{
    extension:'ejs'
}));
app.use(routers.routes())
    .use(routers.allowedMethods());
app.listen('3001',()=> {
    // console.log(myCipher("{'adf':打发第三方}"));//加密
    // myRandom(100000,5).then(result=>{
    //     console.log(result)
    // })//随机数
    //定时任务
    // scheduleProject.createCode();
    console.log('正在监听'+ 3001)
});