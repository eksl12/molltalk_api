const router = require('express').Router()
const controller = require('./controller')

router.post('/register', controller.register)
//router.get('/user/:id', controller.user)
router.post('/login', controller.login)
router.use('/logout', controller.logout)

module.exports = router
