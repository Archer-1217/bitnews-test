const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())


// 注册
router.post('/reguser', (req, res) => {
    console.log('收到的参数是', req.body);

    const { username, password } = req.body;

    const sqlStrSelect = `select username from users where username='${username}'`;
    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, msg: '服务器错误' })
            return
        }
        if (result.length > 0) {
            res.json({ status: 1, message: '注册失败，名字被占用' })
            return
        }

        const sqlStr = `insert into users(username,password) values('${username}','${password}')`

        conn.query(sqlStr, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '注册失败' });
                return
            }
            res.json({ status: 0, message: '注册成功' });
        })
    })
})


// 登录
router.post('/login', (req, res) => {
    console.log('接收到的参数是', req.body);

    const { username, password } = req.body;
    const sqlStr = `select * from users where username='${username}' and password='${password}'`;

    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        if (result.length > 0) {
            const token = 'Bearer ' + jwt.sign(
                { name: username },
                'hehe',  // 加密的密码，要与express-jwt中的验证密码一致
                { expiresIn: 1 * 60 * 60 } // 过期时间，单位是秒
            )
            res.json({ status: 0, message: '登录成功', token })
        } else {
            res.json({ status: 1, message: '登录失败，用户名密码不正确' })
        }
    })
})

module.exports = router;