const Koa = require("koa"); // CJS: require('koa');
const serve = require("koa-static"); // CJS: require('koa-static')
const app = new Koa();
app.use(serve('./'));

app.listen('3000');