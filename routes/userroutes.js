const express = require('express')
const router = express.Router()
const Controller = require('../controllers/user')


router.get('/api/fillProducts/:count', Controller.fillProducts)
router.get('/api/case1/:count', Controller.BulkDataNative)

module.exports = router;
