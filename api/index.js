const router = require('express').Router()
const auth = require('./auth')
const room = require('./room')
const invitation = require('./invitation')
const authCheck = require('../middlewares/auth')
const user = require('./user')

router.use('/', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://mt.zodaland.com')
	res.header('Access-Control-Allow-Headers', 'content-type,authorization')
	res.header('Access-Control-Allow-Credentials', 'true')
	//없어도됨
	res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE,PUT,PATCH,OPTIONS')
	//axios에서 response.header로 전달헤더정보를 읽을수 있게 한다
	//res.header('Access-Control-Expose-Headers', '*')
	//없어도됨
	//res.header('Origin', 'true')
	//res.header('Credentials', 'true')
	//res.header('SameSite', 'None')
	//res.header('withCredentials', 'true')

	/*보안처리
	if (req.headers['Referer'].indexOf('https://my.zodaland.com') !== 0) {
		res.status('403').send('refused')
		return
	}
	*/
	next()
})
router.use('/auth', auth)

router.use('/', authCheck)
router.use('/room', room)
router.use('/invitation', invitation)
router.use('/user', user)

module.exports = router