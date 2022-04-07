const controller = require("../controllers/auth")
const router = require("express").Router()
const multer = require('multer')
const { registerSchema } = require("../util/validation");
const path = require("path");
const {ValidationError} = require("../util/error");
const info = require("../controllers/info")

const fileFilterPhoto = (req, file, cb) => {
    console.log(file)
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new ValidationError(400, 'Only .png, .jpg and .jpeg format allowed!'));
    }
}
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: __dirname+"/../public/avatar",
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix+path.extname(file.originalname))
        },
    }),
    fileFilter: fileFilterPhoto
})


router.get("/info",info)
router.post("/login",registerSchema,controller.LOGIN)
router.post("/register",imageUpload.single('avatar'),registerSchema,controller.REGISTER)

module.exports = router