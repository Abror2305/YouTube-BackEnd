const controller = require("../controllers/video")
const router = require("express").Router()
const multer = require('multer')
const { registerSchema } = require("../util/validation");
const path = require("path");
const {ValidationError} = require("../util/error");
const checkToken = require("../middlewares/checkToken")

const fileFilterVideo = (req, file, cb) => {
    if(!file){
        cb(null, false);
        return cb(new ValidationError(400, 'Only .mp4, .MPV and .AV1 format allowed!'));
    }
    if (file.mimetype === "video/mp4" || file.mimetype === "video/MPV" || file.mimetype === "video/AV1") {
        cb(null, true);
    }
    else {
        cb(null, false);
        return cb(new ValidationError(400, 'Only .mp4, .MPV and .AV1 format allowed!'));
    }
}

const videoUpload = multer({
    storage: multer.diskStorage({
        destination: __dirname+"/../public/videos",
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix+path.extname(file.originalname))
        },
    }),
    fileFilter: fileFilterVideo,
    limits: {fileSize: 50*1024*1024}
})

router.put("/video",checkToken,controller.PUT)
router.get("/video/:fileName",controller.GET)
router.get("/search",controller.SEARCH)

router.post("/video",checkToken,videoUpload.single("video"),controller.POST)
router.delete("/video",checkToken,controller.DELETE)
router.get("/myvideos",checkToken,controller.MYVIDEOS)
module.exports = router