var express = require('express');
var app = express();
var User = require("../modules/user");

var router = express.Router();

var jwt = require('jsonwebtoken'); //用来创建和确认用户信息摘要
var config = require('../../config'); //读取配置文件config.js信息

app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码
//加密算法
var md5 = function(data) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(data);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}

//添加
router.post("/register", function(req, res, next) {
	console.log("====post User=====");
	var {name,password}=req.body;
	User.findOne({
		name: name
	}, function(err, result) {
		if (err) {
			res.json({
				code: 3000,
				success: false,
				message: "系统错误",
				data: err
			});
		}
		console.log(result);
		if (result) {
			res.json({
				code: 2000,
				success: false,
				message: "注册失败，用户名已存在"
			});
		} else {
			var user = new User({
				name: name,
				password: md5(password),
				admin: false
			});

			user.save(function(err, result) {
				if (err) {
					res.json({
						code: 3000,
						success: false,
						message: "注册失败，系统错误！",
						data: err
					});
				} else {
					console.log("success");
					res.json({
						code: 0,
						success: true,
						message: "注册成功",
						data: {
							name: result.name,
							admin: result.admin,
							id: result._id
						}
					});
				}
			})
		}
	});
});

//查询
router.post("/login", function(req, res, next) {
	console.log("=====get User=====");
	var {name,password}=req.body;

	User.findOne({
		name: name
	}, function(err, result) {
		if (err) {
			res.json({
				code: 3000,
				success: false,
				message: "登录失败，系统错误",
				data: err
			});
		}
		if (result) {
			console.log(result);

			if (result.password === md5(password)) {
				var token = jwt.sign({
					msg: "hello"
				}, app.get('superSecret'), {
					expiresIn: 60 * 60 * 24 // 24小时过期
				});
				res.json({
					code: 0,
					success: true,
					message: "登录成功！",
					data: {
						name: result.name,
						admin: result.admin,
						id: result._id,
						token: token
					}
				});
			} else {
				res.json({
					code: 2002,
					success: false,
					message: "登录失败，密码错误~"
				});
			}

		} else {
			console.log(result);
			res.json({
				code: 2001,
				success: false,
				message: "登录失败，用户不存在"
			});
		}
	});
})

module.exports = router;