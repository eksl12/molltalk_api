const express = require('express');
//이전에 만들어 놓은 웹소켓 파일 임포트

var router = express.Router();

router.use('/ws', (req, res) => {

	res.render('websocket');
});

module.exports = router;
