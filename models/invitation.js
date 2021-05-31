const db = require('./db')

const Invitation = {
	getConnection : (data) => {
		return new Promise((resolve, reject) => {
			Invitation.params = data

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
			var sql = "INSERT INTO invitation (room_no, invite_user_no, invited_user_no, reg_date) VALUES (?, ?, ?, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
			con.query(sql, Invitation.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findByInviteUser : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT no, room_no, invite_user_no, invited_user_no, reg_date FROM invitation WHERE invite_user_no = ?"
			con.query(sql, Invitation.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	},

	findByInvitedUser : (con) => {
		return new Promise((resolve, reject) => {
			var sql = "SELECT no, room_no, invite_user_no, invited_user_no, reg_date FROM invitation WHERE invited_user_no = ?"
			con.query(sql, Invitation.params, (err, rows) => {
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
			var sql = "DELETE FROM invitation WHERE no = ?"
			con.query(sql, Invitation.params, (err, rows) => {
				con.release()
				if (err) {
					reject(err)
				}
				resolve(rows)
			})
		})
	}
}

module.exports = Invitation
