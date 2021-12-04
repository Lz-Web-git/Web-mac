const expresss = require('express');
const app = expresss();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./Router/useRouter')
const data = require('./DataBase/connnect')
const User = require('./DataBase/userModel')
var corsOptions = {
    origin: ['http://localhost:3000','http://localhost:3001'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(router)
app.listen(3040,()=>{
    console.log("node服务已经开启");
})