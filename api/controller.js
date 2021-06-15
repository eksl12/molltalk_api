const Auth = require('../middlewares/auth')

exports.setDefault = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://mt.test.zodaland.com')
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
	//preflight시 메소드 OPTIONS 으로 들어오고 에러 처리돼서 예외처리
	if (req.method === 'OPTIONS') {
		console.log('options')
		res.json({ code: '0000' })
		return
	}

	next()
}

exports.confirmAuthorization = async (req, res, next) => {
	const accessTokenResult = await Auth.getDecodedAccessTokenData(req)

	if (accessTokenResult.code === '0000') {
		req.decoded = accessTokenResult
		next()
		console.log('엑세스토큰 유효 통과')
		return
	}

	const refreshTokenResult = await Auth.checkRefreshToken(req)

	if (refreshTokenResult.code !== '0000') {
		res
		.cookie('token', '', { expires: new Date(Date.now() - (360000)) })
		.json(refreshTokenResult)
		console.log('리프레시 토큰 무효 짤림 : ' + refreshTokenResult.code)
		return
	}

	const userNo = refreshTokenResult.no
	const newAccessTokenResult = await Auth.reIssueToken(userNo)

	if (newAccessTokenResult.code !== '0000') {
		res
		.cookie('token', '', { expires: new Date(Date.now() - (360000)) })
		.json(newAccessTokenResult)
		console.log('새 엑세스 토큰 무효 짤림')
		return
	}
	const decoded = {
		id: newAccessTokenResult.id,
		name: newAccessTokenResult.name
	}

	req.token = newAccessTokenResult.accessToken
	
	req.decoded = decoded
	
	next()
	console.log('전체 통과')
}

exports.hello = async (req, res) => {
	const refreshTokenResult = await Auth.checkRefreshToken(req)

	if (refreshTokenResult.code !== '0000' && refreshTokenResult.code !== '0001') {
		res
		.cookie('token', '', { expires: new Date(Date.now() - (360000)) })
		.json(refreshTokenResult)
		console.log('hello fail')
		return
	}

	res.json({
		code: refreshTokenResult.code
	})
}

exports.setAuthData = (req, res) => {

	let result = {
		userInfo: {
			id: req.decoded.id,
			name: req.decoded.name
		}
	}

	if (req.token) {
		result.accessToken = req.token
	}

	res.json({
		code: '0000',
		...result
	})
}