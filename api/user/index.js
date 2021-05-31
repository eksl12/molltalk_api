const router = require('express').Router()
const controller = require('./controller')

router.get('/:id', controller.findById)

module.exports = router