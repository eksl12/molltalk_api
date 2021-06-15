module.exports = (() => {
	const errorMessage = {
		'0000' : '',
		'0001' : '',
		'4000' : '통신 중 오류가 발생하였습니다.',
		'9701' : '올바르지 않은 정보입니다.',
		'9702' : '다른곳에서 로그인되어 로그아웃 됩니다.',
		'9703' : '일정 시간이 지나 로그아웃 됩니다.',
		'9704' : '토큰 값 없음',
		'9705' : '토큰 유효기간 만료'
	}

	return {
		get: (code) => {
			if (typeof errorMessage[code] === 'undefined') {
				return errorMessage['4000']
			}

			return errorMessage[code]
		}
	}
})()