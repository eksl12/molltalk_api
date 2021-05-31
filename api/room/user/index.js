const router = require('express').Router()
const controller = require('./controller')

router.get('/:roomNo/user/:userNo', controller.findRoom)
router.get('/user/:userNo', controller.findRooms)
router.post('/user', controller.create)
router.delete('/:roomNo/user/:userNo', controller.delete)
router.patch('/:roomNo/user/:userNo', controller.update)


module.exports = router
