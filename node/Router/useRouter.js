var express = require('express');
var router = express.Router();
var UserModel = require('../DataBase/userModel');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
/*
*最外层判断token是为了检查token是否存在
*里边判断用户名是否存在是为了进一步确认(防止用户伪造cookie进而向服务器中存储垃圾数据)
*
*/
router.post('/newProfile',(req,res)=>{
    let {token} = req.headers;
    console.log('token:',token);
    if(token != 'undefined'){
          let data = []
          console.log("jinlaizhegfelll")
          req.on('data', chunk => {
             data.push(chunk)  // 将接收到的数据暂时保存起来
         })
          req.on('end', () => {
          // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
          let reqdata = JSON.parse(data)
          let {username,passage,text} = reqdata;
          console.log(username)
          if(username != ''){
                UserModel.findOneAndUpdate({username:username},{$set:{filepassage:passage,filetext:text}},{upsert:true},(err,raw)=>{
                console.log('newfile',err,raw);
                res.send("请求成功");
            })
            }
        else res.send('身份验证失败，请先登录');
        })
    }
    else res.send('token 身份验证失败，请先登录');
  
    
})
router.post('/newProject',(req,res)=>{
    let {token} = req.headers;
    if(token != 'undefined'){
        let data = [];
        req.on('data', chunk => {
            data.push(chunk)  // 将接收到的数据暂时保存起来
    })
        req.on('end', () => {
            // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
            let reqdata = JSON.parse(data)
            console.log(reqdata)
            let {username,jectPassage,jectText} = reqdata;
            // if(username )
            if(username != ''){
                UserModel.updateOne({username:username},{$set:{jectpassage:jectPassage,jecttext:jectText}},{upsert:true},(err,raw)=>{
                    console.log(err,raw);    
                    res.send("请求成功");
                })
            }
        else res.send('身份验证失败，请先登录');
       
    })
    }
    else res.send('token身份验证失败，请先登录');
  
  
})
router.post('/register', (req, res) => {

    let data = [];
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        // console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        // console.log(reqdata,1)
        let {username,password,Nikname,Gender} = reqdata;
        let secretPassword = md5(password)
        UserModel.findOne({ username }, (err, user) => {
            // console.log(user,2)
            if (user) {
                res.send({code:-1, msg:'此用户已存在'})
            }
            else {
                new UserModel({ username,secretPassword,Nikname,Gender}).save((err, user) => {
                    if (err) {
                        // console.log(err);
                    }
                    else {
                          // 生成一个 cookie(userid: user._id), 并交给浏览器保存
                    //  res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 }) // 持久化 cookie, 浏`览器会保存在本地文件
                    //  // 返回包含user的json数据
                    //  const data = {username, _id:user._id,msg:'注册成功！'}  //响应数据中不要携带password
                    const data = {username,msg:'注册成功！'}  
                    res.send({code:1 ,username,msg:'注册成功！'})
                    }
                })
            }

    })
  
    })
})
// 用户登录
router.post('/login', (req, res) => {
    let data = []
    req.on('data', chunk => {
        data.push(chunk)  // 将接收到的数据暂时保存起来
    })
    req.on('end', () => {
        console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
        let reqdata = JSON.parse(data)
        // console.log(reqdata)
        // User.updateOne({SNo:reqdata.SNo},{$set:{text:reqdata.text}},{upsert:true},(err,raw)=>{
        //     console.log(err,raw);
        // })
        let {username,password,remember} = reqdata
        let secretPassword = md5(password)
        // console.log(secretPassword);
        // const header={username,remember}
    UserModel.findOne({ username,secretPassword},  (err, user) => {
        console.log(user,1)
        if (user) {
            // res.cookie('userid', user._id, { maxAge: 3000 }) // 持久化 cookie, 浏 览器会保存在本地文件
            const header = {username,_id:user._id}
            var token = jwt.sign(header,username,{expiresIn:60*1000**60*24})
            console.log(token);
            res.send({code:1, data,msg:'登录成功!',token:token})
        }
        else {
            res.send({code:-1, msg:'用户名或密码不正确或者未注册'})
        }
    })
    })
    
})
router.post("/getData",(req,res)=>{
    let {token} =req.headers;
    // console.log(req.headers,token)
    console.log("token:",token,token != 'undefined')
    if(token != 'undefined'){//值为undefined在if判断中还是true
        let data = [];
        console.log('123')
        req.on('data', chunk => {
            data.push(chunk)  // 将接收到的数据暂时保存起来
        })
        req.on('end', () => {
            console.log(JSON.parse(data)) // 数据传输完，打印数据的内容
            let reqdata = JSON.parse(data)
            let{username} = reqdata;
            console.log(1, username)
            jwt.verify(token,username,(err,decoded)=>{          
                if(decoded != undefined ){
                    UserModel.findOne({username:username},(err,user)=>{
                        // console.log(2,user)
                        if(err)
                            res.send({code:-1,msg:获取信息失败,error:err})
                        else{
                            let data = {
                                passage: user.filepassage,
                                text: user.filetext,
                                jectPassage: user.jectpassage,
                                jectText:user.jecttext,
                                username:username
                                
                            }
                            res.send({code:1,msg:"获取数据成功",data:data})
                        }
                 })
                }
                else{
                    res.send({code:-2,msg:"身份认证失败"})
                }
            })
            // UserModel.findOne({username:username},(err,user)=>{
            //     console.log(user)
            //     if(err)
            //         res.send({code:-1,msg:获取信息失败,error:err})
            //     res.send('已经找到')
            // })
            // User.updateOne({SNo:reqdata.SNo},{$set:{text:reqdata.text}},{upsert:true},(err,raw)=>{
            //     console.log(err,raw);
            // })
            // res.send("token失败")
        })
        
        
    }else{
            res.send('token验证失败')
    }
})
module.exports = router;