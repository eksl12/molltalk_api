exports.checkValidIp = (ip) => {
	const pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

	if (!ip || !pattern.test(ip)) {
		return false
	}
	return true
}