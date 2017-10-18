var mongoose=require('mongoose');
var Schema = mongoose.Schema;

// 使用 module.exports 导出 模块
module.exports=mongoose.model("Cate",new Schema({
    title: String
}))