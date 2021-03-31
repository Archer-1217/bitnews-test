const express = require('express')
const cors = require('cors')

const userRouter = require('./router/user_router.js')
const accountRouter = require('./router/account_router.js')
const cateRouter = require('./router/cate_router.js')

const server = express()

const jwt = require('express-jwt');
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证

// server.use(jwt({
//     secret: 'hehe', // 生成token时的 钥匙，必须统一
//     algorithms: ['HS256'] // 必填，加密算法，无需了解
// }).unless({
//     path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
// }));


server.use(cors());
server.use('/uploads', express.static('uploads'));

server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});

server.use('/api', accountRouter)
server.use('/my', userRouter)
server.use('/my/article', cateRouter)

server.listen(3000, () => {
    console.log('3000端口启动成功');
})

