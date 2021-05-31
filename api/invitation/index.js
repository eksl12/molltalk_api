const router = require('express').Router()
const controller = require('./controller')

router.post('/', controller.create)
router.get('/to/:no', controller.findByInvitedUser)
router.get('/from/:no', controller.findByInviteUser)
router.delete('/:no', controller.delete)

module.exports = router
