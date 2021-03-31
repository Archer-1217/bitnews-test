const express = require('express')
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())


//获取文章分类列表
router.get('/cates', (req, res) => {
    console.log('接收到的参数是', req.query);

    const sqlStr = `select * from categories`

    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        res.json({ status: 0, message: '获取文章分类列表成功', data: result })
    })
})


// 新增文章分类
router.post('/addcates', (req, res) => {

    let { name, slug } = req.body;

    const sqlStrSelect = `insert into categories (name,slug) values ('${name}','${slug}')`

    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: 500, msg: "服务器错误" })
            return
        }
        res.json({
            status: 0, msg: "新增文章分类成功"
        })
    })
})


//删除文章分类
router.get('/deletecate', (req, res) => {
    let { id } = req.query;

    const sqlStrSelect = `delete from categories where id=${id}`

    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: 500, msg: "服务器错误" })
            return
        }
        res.json({
            status: 0, msg: "删除文章分类成功"
        })
    });
})

//根据id获取文章分类数据
router.get('/getCatesById', (req, res) => {
    let { id } = req.query;

    const sqlStrSelect = `select * from categories where id=${id}`

    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: 500, msg: "服务器错误" })
            return
        }
        res.json({
            status: 0, msg: "获取文章分类数据成功",
            data: result[0]
        })
    })
})


//更新分类
router.post('/updatecate', (req, res) => {
    let { id, name, slug } = req.body;

    const sqlStrSelect = `update categories set name="${name}",slug="${slug}" where id=${id}`

    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: 500, msg: "服务器错误" })
            return
        }

        res.json({
            status: 0, msg: "更新分类信息成功"
        })

    })
})



module.exports = router