const router = require('express').Router()
const auth = require('./auth')
const room = require('./room')
const invitation = require('./invitation')
const checkAuth = require('../middlewares/auth')
const user = require('./user')
const controller = require('./controller')

//next
router.use('/', controller.setDefault)

router.use('/auth', auth)

router.use('/hello', controller.hello)
//next
router.use('/', controller.confirmAuthorization)

router.use('/validation', controller.setAuthData)

router.use('/room', room)
router.use('/invitation', invitation)
router.use('/user', user)

module.exports = router
