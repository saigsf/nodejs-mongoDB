var express = require('express');

var User = require("../modules/user");

var router = express.Router();

//加密算法
var md5 = function(data) {
	var Buffer = require("buffer").Buffer;
	var buf = new Buffer(data);
	var str = buf.toString("binary");
	var crypto = require("crypto");
	return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}

router.get('/', function(req, res) {
	// 创建一个测试用户
	var admin = new User({
		name: 'admin',
		password: md5('root'),
		admin: true
	});

	User.findOne({
		name: admin.name
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
				message: "注册失败，管理员已经已存在"
			});
		} else {

			// 将测试用户保存到数据库
			admin.save(function(err) {
				if (err) {
					res.json({
						code: 10000,
						success: false,
						message: "添加管理员失败",
						data: err
					});
				} else {
					res.json({
						code: 0,
						success: true,
						message: "添加管理员成功"
					});
				}

			});
		}

	});

});

module.exports = router;