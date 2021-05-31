const router = require('express').Router()
const room = require('./controller')
const user = require('./user')

router.post('/', room.create)
router.get('/:no', room.find)
router.delete('/:no', room.delete)

router.use('/', user)

module.exports = router
