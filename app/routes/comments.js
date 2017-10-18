var express = require('express');
var Blog = require("../modules/blog");

var router = express.Router();

//添加评论
//找，改，保存
router.post('/', function(req, res) {
	var {
		id,
		body
	} = req.body;
	Blog.findById(id, function(err, blog) {
		if (err) {
			res.json({
				code: 3000,
				message: "添加评论错误！系统错误"
			})
		} else {
			blog.comments.push({
				body: body,
				date: new Date()
			});

			blog.save(function(err, result) {
				if (err) {
					res.json({
						code: 4000,
						message: "添加评论错误！"
					})
				}
				res.json({
					message: "添加评论成功！",
					data: result
				})
			})
		}

	})
})

//删除评论
//找，改，保存
router.delete('/', function(req, res) {
	var {
		id
	} = req.body;
	Blog.findById(id, function(err, result) {
		if (err) {
			res.json({
				code: 3000,
				message: "添加评论错误！系统错误"
			})
		} else if (result) {

			result.remove(function(err, result) {
				if (err) {
					res.json({
						code: 4001,
						message: "删除评论失败！"
					})
				}
				res.json({
					message: "删除评论成功！",
					data: result
				})
			})
		} else {
			res.json({
				code: 4002,
				message: "删除评论失败！,没有你想要的评论"
			})
		}

	})
})

module.exports = router;