const mysql = require('mysql');
const conf = require('../config/db_config');

module.exports = (() => {
	var pool = mysql.createPool({
		host: conf.host,
		user: conf.user,
		password: conf.password,
		port: conf.port,
		database: conf.database
	});
	
	return {
		getConnection: function(callback) {
			pool.getConnection(callback);
		},
		end: function(callback) {
			pool.end(callback);
		}
	};
})();
