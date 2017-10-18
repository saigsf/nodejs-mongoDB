var express = require('express');
var app = express();
var Blog = require("../modules/blog");

var router = express.Router();

var jwt = require('jsonwebtoken'); //用来创建和确认用户信息摘要
var config = require('../../config'); //读取配置文件config.js信息

app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码

//中间件
//router.use(function(req, res, next) {
//  //检查post的信息或者url查询参数或者头信息
//  var token = req.body.token || req.query.token || req.headers['x-access-token'];
//  // 解析 token
//  if (token) {
//
//      // 确认token
//      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//          if (err) {
//              return res.json({
//                  code: 3000,
//                  success: false,
//                  message: 'token信息错误.'
//              });
//          } else {
//              // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
//              req.decoded = decoded;
//              next();
//          }
//      });
//
//  } else {
//
//      // 如果没有token，则返回错误
//      return res.status(403).send({
//          success: false,
//          message: '没有提供token！'
//      });
//
//  }
//});

//添加博文数据
router.post("/add", function(req, res) {
	console.log("====添加博文数据===");

	var {
		title,
		body,
		author,
		tags,
		hidden,
		cate
	} = req.body;

	if (title.length < 3) {
		res.json({
			code: 3003,
			success: false,
			message: "添加博文失败，标题长度不能小于3"
		});
	}

	var tagsArr = tags.split(",");

	var tagsObjArr = [];
	tagsArr.forEach(function(v) {
		tagsObjArr.push({
			title: v
		});
	});

	var blog = new Blog({
		title: title,
		body: body,
		author: author,
		cate: cate,
		tags: tagsObjArr,
		hidden: hidden || false
	});

	blog.save(function(err, result) {
		if (err) {
			res.json({
				code: 3001,
				success: false,
				message: "添加博文失败",
				data: err
			});
		} else {
			res.json({
				code: 0,
				success: true,
				message: "添加博文成功",
				data: result
			});
			console.log("====添加博文数据成功===");
		}
	});

});

//查询博文数据
router.get("/search", function(req, res) {
	console.log("====查询博文数据====");

	var {cate} = req.query;
	
	var searchStr={};
	if(cate){
		var reg=new RegExp('^'+cate+'$');
		searchStr={cate:reg}
	}

	//查询所有
	Blog.find(searchStr, function(err, result) {
		if (err) {
			res.json({
				code: 3002,
				success: false,
				message: "查询博文失败",
				data: err
			});
		}
		if (result) {
			res.json({
				code: 0,
				success: true,
				message: "查询博文成功",
				data: result
			});
			console.log("====查询博文数据成功===");
		}
	});
});

//更新博文数据
router.post("/update", function(req, res) {
	console.log("===更新博文数据===");
	//解构赋值
	var {
		id,
		newData
	} = req.body;
	console.log(newData)
	Blog.findOneAndUpdate({
		_id: id
	}, {
		title: newData,
		update: new Date()
	}, function(err, result) {
		console.log(result);
		if (err) {
			console.log(err);
			res.json({
				code: 3006,
				success: false,
				message: "更新失败",
				data: err
			});
		} else {
			res.json({
				code: 0,
				success: true,
				message: "更新成功",
				data: result
			});
		}
	});
})

//删除博文数据
router.delete("/del", function(req, res) {
	console.log("===删除博文数据===");
	var id = req.body.id;
	Blog.remove({
		_id: id
	}, function(err, result) {
		console.log(result);
		if (err) {
			console.log(err);
			res.json({
				code: 3004,
				success: false,
				message: "删除博文失败",
				data: err
			});
		} else {
			if (result.n == 0) {
				res.json({
					code: 3005,
					success: false,
					message: "哎呀~博文找不到啊！"
				});
			} else {
				res.json({
					code: 0,
					success: true,
					message: "删除博文成功",
					data: result
				});
			}

		}
	});

})

module.exports = router;