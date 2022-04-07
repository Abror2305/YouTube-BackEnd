const router = require("express").Router()
const auth = require("./auth")
const video = require("./video")

router.use(auth)
router.use(video)

module.exports = router