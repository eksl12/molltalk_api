const db = require('./db')

const Room = {
	getConnection : (data) => {
		return new Promise((resolve, reject) => {
			Room.params = data

			db.getConnection((err, con) => {
				if (err) {
					reject(err)
				}
				resolve(con)
			})
		})
	},

	create : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "INSERT INTO room (reg_date, private) VALUES (DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), ?)";
			con.query(sql, Room.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	find : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT no, reg_date, private FROM room WHERE no = ?";

			con.query(sql, Room.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	delete : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "DELETE FROM room WHERE no = ?";

			con.query(sql, Room.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	}
}

module.exports = Room
