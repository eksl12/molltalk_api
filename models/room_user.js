const db = require('./db')

const RoomUser = {
	getConnection: (data) => {
		return new Promise((resolve, reject) => {
			RoomUser.params = data		

			db.getConnection((err, con) => {
				if (err) {
					reject(err)
				}
				resolve(con)
			})
		})
	},

	create: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "INSERT INTO room_user (user_no, room_no, join_date) VALUES (?, ?, ?)"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
					resolve(rows)
			})
		})
	},

	findRooms: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT no, room_no, user_no, name, join_date, exit_date FROM room_user WHERE user_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findRoom: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT no, room_no, user_no, name, join_date, exit_date FROM room_user WHERE user_no = ? AND room_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findDup: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT COUNT(no) as count FROM room_user WHERE user_no = ? AND room_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				const count = rows[0].count
				resolve(count)
			})
		})
	},

	delete: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "DELETE FROM room_user WHERE user_no = ? AND room_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	updateName: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "UPDATE room_user SET name = ? WHERE user_no = ? AND room_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	updateExitDate: (con) => {
		return new Promise((resolve, reject) => {
			var sql = "UPDATE room_user SET exit_date = ? WHERE user_no = ? AND room_no = ?"
			con.query(sql, RoomUser.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	}
}

module.exports = RoomUser
