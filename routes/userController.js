const express = require('express');
const user = require('./../models/user');

var router = express.Router();

router.use('/reg', (req, res) => {
	console.log(res.header);
	res.render('regist');
});

router.post('/user', (req, res) => {
	const userInfo = req.body;

	var params = [ userInfo.id, userInfo.password, userInfo.name ];

	user.setUser(params, (err, rows) => {
		if (err) {
			return res.send("등록 실패 하였습니다.");
		}
		res.send(userInfo.name + "님 반갑습니다.");

		user.end();
	});
	
});

router.use('/login', (req, res) => {
	res.render('login');
});


module.exports = router;
