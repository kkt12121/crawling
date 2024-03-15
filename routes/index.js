const router = require('express').Router()

const main = require('./main.page')

router.post('/', main)
router.get('/caseSummary', main)
router.get('/inflearn', main)
router.get('/caseNote_caseLaw', main)
router.get('/caseNote_decision', main)
router.get('/htmlAPI_laws', main)
router.get('/htmlAPI_laws2', main)
router.get('/inspection', main)

module.exports = router