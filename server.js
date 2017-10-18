/**
 * Created by waitfish on 15/5/11.
 */
// =======================
// 声明我们需要的模块 ============
// =======================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); //用来创建和确认用户信息摘要
var config = require('./config'); //读取配置文件config.js信息

//导入路有文件
var cateRoute=require('./app/routes/cate');
var userRoute=require('./app/routes/user');
var blogRoute=require('./app/routes/blog');
var setupRoute=require('./app/routes/setup');
var commentsRoute=require('./app/routes/comments');

// =======================
// 配置 =========
// =======================
var port = process.env.PORT || 8080; // 设置启动端口
mongoose.connect(config.database); // 连接数据库
app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码
// 允许跨域访问
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //设置允许的主机地址是，*任意
    res.header("Content-Type", "application/json;charset=utf-8"); //数据格式是json，语言是utf-8
    next(); //执行完all 之后继续执行下面的接口
});
//用body parser 来解析post和url信息中的参数
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'));

// =======================
// 路由 ================
// =======================


app.use("/cate",cateRoute);
app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.use("/setup",setupRoute);
app.use("/comments",commentsRoute);

// =======================
// 启动服务 ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);