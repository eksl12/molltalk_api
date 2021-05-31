/******************************************






******************************************/

const db = require('./db');

const User = {
	getConnection : (data) => {
		return new Promise( (resolve, reject) => {
			User.params = data

			db.getConnection((err, con) => {
				if (err) {
					reject(err)
				}
				resolve(con);
			})
		})
	},

	create : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "INSERT INTO user (id, password, name, reg_date) VALUES (?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))";
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	verify : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "SELECT no,id, name FROM user WHERE id = ? AND password = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findById : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "SELECT count(no) as count FROM user WHERE id = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findByNo : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "SELECT count(no) as count FROM user WHERE no = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	getUserData : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "SELECT no, id, name, ip FROM user WHERE no = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	getNoById : (con) => {
		return new Promise( (resolve, reject) => {
			var sql = "SELECT no FROM user WHERE id = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	updateAuthData : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "UPDATE user SET login_date = ?, ip = ? WHERE no = ?";
			
			con.query(sql, User.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	}
}

module.exports = User
