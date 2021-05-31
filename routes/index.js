const express = require('express')

var router = express.Router()

router.use('/ws', (req, res) => {
	res.render('websocket')
})

router.use('/reg', (req, res) => {
    res.render('regist')
})

router.use('/login', (req, res) => {
    res.render('login');
});

module.exports = router
