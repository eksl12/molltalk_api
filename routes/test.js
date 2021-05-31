const express = require('express');
//자바 서버로 요청 보내기 위한 라이브러리
const request = require('request');

//라우터로 사용하겠다.
var router = express.Router();

//next : 현재 라우팅에서만 처리하지 않고 다음 라우팅이 있다면 처리하겠다.
router.get('/sample', (req, res, next) => {
	res.render('test/sample', { query : 'test' });
});

router.get('/java', function(req, res) {
    var spr_res = "";

    request({
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        url: 'http://zodaland.com/java',
    }, function(error, res, body) {
        if (error) {
            console.log("error!!");
            console.log(error);
        }
        spr_res = body;
        console.log("body : " + spr_res);
        console.log("body type : " + typeof(spr_res));
        console.log("");
    });
	//비동기 처리로 인해 spr_res 값 출력되지않음 참고 요망
    console.log("out body : " + spr_res);

    res.send(spr_res);

});
//라우터로서 익스포트 하겠다는 선언
module.exports = router;
