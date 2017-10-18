var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 使用 module.exports 导出 模块
module.exports = mongoose.model("Blog", new Schema({
	title: String,
	body: String,
	author: String,
	cate:String,
	comments: [{
		body: String,
		date: Date
	}],
	date: {
		type: Date,
		default: Date.now
	},
	update: {
		type: Date,
		default: Date.now
	},
	tags: [{
		title: String
	}],
	hidden: Boolean,
	mete: {
		votes: Number,
		favs: Number
	}
}))