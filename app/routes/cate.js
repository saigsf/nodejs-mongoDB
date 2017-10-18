
var express = require('express');
var app = express();
var Cate=require("../modules/cate");

var router = express.Router();
var jwt = require('jsonwebtoken'); //用来创建和确认用户信息摘要
var config = require('../../config'); //读取配置文件config.js信息

app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码

router.use(function(req, res, next) {
    //检查post的信息或者url查询参数或者头信息
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // 解析 token
    if (token) {

        // 确认token
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    code: 3000,
                    success: false,
                    message: 'token信息错误.'
                });
            } else {
                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // 如果没有token，则返回错误
        return res.status(403).send({
            success: false,
            message: '没有提供token！'
        });

    }
});


//添加
router.post("/",function(req,res,next){
	console.log("====post cate=====");
	
	var title=req.body.title;
	
	var cate=new Cate({
		title:title
	});
	cate.save(function(err){
		if(err){
			res.json({
				code:1000,
				success:false,
				message:"添加失败",
				data:err
			});
		}else{
			res.json({
				code:0,
				success:true,
				message:"添加成功"
			});
		}
	})
	
	
})
//查询
router.get("/",function(req,res,next){
	console.log("=====get cate=====");
	Cate.find({},function(err,result){
		if(err){
			res.json({
				code:1001,
				success:false,
				message:"查询失败",
				data:err
			});
		}
		if(result){
			res.json({
				code:0,
				success:true,
				message:"查询成功",
				data:result
			});
		}
	});
})
//更新
router.put("/",function(req,res,next){
	console.log("=====put cate=====");
	//解构赋值
	var {title,newTitle}=req.body;
	
	Cate.findOneAndUpdate({ title:title }, { title: newTitle }, function(err,result){
		console.log(result);
		if(err){
			console.log(err);
			res.json({
				code:1002,
				success:false,
				message:"更新失败",
				data:err
			});
		}else{
			res.json({
				code:0,
				success:true,
				message:"更新成功",
				data:result
			});
		}
	});
	
})
//删除
router.delete("/",function(req,res,next){
	console.log("=====delete cate=====");
	var title=req.body.title;
	Cate.remove({title:title},function(err,result){
		console.log(result);
		if(err){
			console.log(err);
			res.json({
				code:1003,
				success:false,
				message:"删除失败",
				data:err
			});
		}else{
			res.json({
				code:0,
				success:true,
				message:"删除成功",
				data:result
			});
		}
	});
	
})









module.exports = router;