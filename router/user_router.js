const express = require('express');
const router = express.Router();
const conn = require('../util/sql.js');
const jwt = require('jsonwebtoken');

const multer = require('multer')
// const upload = multer({dest: 'uploads'})
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})

const upload = multer({ storage });


//获取用户基本信息
router.use(express.urlencoded());

router.get('/userinfo', (req, res) => {

    const { username } = req.query;

    const sqlStr = `select * from users where username='${username}'`;
    conn.query(sqlStr, (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        res.json({ status: 0, message: '获取用户基本信息成功', data: result[0] })
    })
})


//修改用户信息
router.post('/userinfo', (req, res) => {

    console.log('接收到的参数是', req.body);

    const { id, nickname, email, userPic } = req.body;

    const condition = [];

    if (nickname) {
        condition.push(`nickname="${nickname}"`)
    }
    if (email) {
        condition.push(`email="${email}"`)
    }
    if (userPic) {
        condition.push(`userPic="${userPic}"`)
    }
    const conditionStr = condition.join();

    const sqlStr = `update users set ${conditionStr} where id="${id}"`

    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        res.json({ status: 0, message: '修改用户信息成功', })
    })
})


// 上传文件
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    console.log('接收到的文件是', req.body);

    res.json({
        status: 0,
        message: '上传成功',
        src: 'http://127.0.0.1:3000/uploads/' + req.file.filename
    });
})


// 重置密码
router.post('/updatepwd', (req, res) => {
    console.log('接受到的参数是', req.body);

    const { oldPwd, newPwd, id } = req.body;

    const sqlStrSelect = `select password from users where id=${id}`;
    conn.query(sqlStrSelect, (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        if (result[0].password !== oldPwd) {
            res.json({ status: 1, message: '旧密码输入错误' })
            return
        }

        const sqlStr = `update users set password=${newPwd} where id=${id}`;
        conn.query(sqlStr, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 500, message: '服务器错误' })
                return
            }
            res.json({ status: 0, message: '修改密码成功', })
        })
    })

})

module.exports = router;