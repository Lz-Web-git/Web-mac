var mongoose = require('mongoose')
var Schema = mongoose.Schema;
//连接数据库
var userSchema = new Schema({
    username: { type: String},
    secretPassword: {type: String}, 
    Nikname:{type: String},
    Gender:{type: String},
    SNo:{type:String},
    filepassage:{type:Array},//二级文件夹的信息
    filetext:{type:Array},//profile文本内容
    jectpassage:{type:Array},//二级文件夹的信息
    jecttext:{type:Array}//project文本内容
   
})
var User = mongoose.model('userInform',userSchema)
module.exports = User;