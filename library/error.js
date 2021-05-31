module.exports = (() => {
	const mysqlError = {
		ER_DUP_ENTRY				: {
			'code'		: '9100',
			'message'	: 'duplicate data'
		},
		PROTOCOL_SEQUENCE_TIMEOUT	: {
			'code'		: '9101',
			'message'	: 'connection timeout'
		},
		ETIMEDOUT					: {
			'code'		: '9101',
			'message'	: 'connection timeout'
		},
		WARN_DATA_TRUNCATED			: {
			'code'		: '9102',
			'message'	: 'exceed value'
		}
	}

	const defaultError = {
		INVALID_VALUE				: {
			'code'		: '9999'
		},
		DUP_VALUE					: {
			'code'		: '9998'
		},
		FOUND_NO_DATA				: {
			'code'		: '9997'
		},
		PROCESS_FAILURE			: {
			'code'		: '9990'
		},
		CONNECTION_FAILURE		: {
			'code'		: '9000'
		},
		NOT_EXIST_SUCCEEDED_DATA	: {
			'code'		: '9996'
		},
		SERVER_ERROR				: {
			'code'		: '8888'
		},
		UNKNOWN_ERROR				: {
			'code'		: '7777'
		},
		AUTHENTICATION_FAILURE		: {
			'code'		: '9996'
		}
	}

	return {
		get : (error) => {
			console.log('---------ERROR-----------')
			console.log(error)
			console.log('-------------------------')
			const message = error.code || error

			if (!message) {
				return defaultError.UNKNOWN_ERROR
			}

			for (var mysqlErrorMessage in mysqlError) {
				if (mysqlErrorMessage === message) {
					return mysqlError[mysqlErrorMessage]
				}
			}

			for (var defaultErrorMessage in defaultError) {
				if (defaultErrorMessage === message) {
					return defaultError[defaultErrorMessage]
				}
			}

			return defaultError.SERVER_ERROR
		}
	}
})()