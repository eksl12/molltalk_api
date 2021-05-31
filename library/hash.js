const crypto = require('crypto');
const config = require('../config/auth_config');

const Hash = {
	convert : (param) => {
		return crypto.createHmac('sha512', config.secretKey).update(param).digest('hex');
	}
}

module.exports = Hash;

