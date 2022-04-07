const {InternalServerError} = require("../util/error");

function info(req,res,next){
    try{
        let users = req.readFile("users")
        const videos = req.readFile("videos")

        users = users.map(el => {
            delete el.password
            return el
        })
        res.json({
            ok:true,
            message:"Ok",
            users,
            videos
        })
    } catch (e) {
        next(new InternalServerError(e.message))
    }
}

module.exports = info