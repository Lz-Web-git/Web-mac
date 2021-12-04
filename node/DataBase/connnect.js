// var mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1/files',{
//     useNewUrlParser: true });
// var db = mongoose.connection;
// db.once('open',(err)=>{
//     console.log("连接")
// })
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/newfile',{
    useNewUrlParser: true 
})

//监听数据库连接状态
mongoose.connection.once('open',(err)=>{
    console.log("123,已经开启")
})
