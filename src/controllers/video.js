const {ValidationError, InternalServerError, AuthorizationError} = require("../util/error")
const path = require("path");
const fs = require("fs");

function SEARCH(req,res){
    try{
        let { userId,search } = req.query

        let videos = req.readFile("videos")
        let users = req.readFile("users")
        search = search ? search.toLowerCase().trim(): search
        videos = videos.filter(video => {

            console.log(userId ? video.userId == userId : true)
            return userId ? video.userId == userId : true
            && search ? video.Title.toLowerCase().includes(search) : true
        })
        if(videos.length){
            videos.map(el => {
                let date = new Date(el.Created)
                el.user = users.find(user => user.userId ===el.userId)
                delete el.userId
                el.size = (el.size/1024/1024).toFixed(1)
                el.Created = date.toLocaleDateString('en-ZA')+"|"+date.getHours()+"."+date.getMinutes()
                return el
        })}

        res.json({
            ok:true,
            message:"ok",
            videos
        })
    }
    catch (e){
        return InternalServerError(e.message)
    }
}

function MYVIDEOS(req,res,next){
    try{
        let user = req.userId
        let videos = req.readFile("videos")

        videos = videos.filter(video => {
            return video.userId === req.userId
        })
        res.json({
            ok:true,
            message:"ok",
            videos
        })
    }
    catch (e){
        return next(new AuthorizationError(400,e.message))
    }
}

function POST(req, res, next) {
    try {
        let {Title} = req.body

        if (!req.file) {
            return next(new ValidationError(400, "The video is required!"))
        }

        const size = req.file.size
        const fileName = req.file.filename
        Title = Title?.trim()
        if (!Title) {
            return next(new ValidationError(400, "Title is required!"))
        }
        if (Title.length < 3 || Title.length > 30) {
            return next(new ValidationError(400, "Title is too long or small!"))
        }

        const videos = req.readFile('videos')

        const newVideo = {
            videoId: videos.length ? videos[videos.length - 1].videoId + 1 : 1,
            userId: req.userId,
            Title,
            fileName,
            size,
            Created: new Date()
        }
        videos.push(newVideo)
        req.writeFile("videos", videos)

        res.json({
            ok: true,
            message: "Video uploaded"
        })
    } catch (e) {
        return next(new InternalServerError(e.message))
    }
}

function PUT(req, res, next) {
    try {
        let {videoId, Title} = req.body
        console.log(req.body)
        if (!videoId) {
            return next(new ValidationError(400, "videoId is required!"))
        }

        if (!Title) {
            return next(new ValidationError(400, "Title is required!"))
        }
        Title = Title?.trim()
        if (Title.length < 3 && Title.length > 30) {
            return next(new ValidationError(413, "Title is too long or small!"))
        }

        const videos = req.readFile("videos")
        const video = videos.find(video => video.videoId === videoId && video.userId === req.userId)

        if (!video) {
            return next(new ValidationError(404, "There is no such video!"))
        }

        video.Title = Title

        req.writeFile("videos", videos)

        return res.status(201).json({
            ok: true,
            message: "The video updated!",
            video: video
        })
    } catch (e) {
        next(new InternalServerError(e.message))
    }
}

function DELETE(req,res,next){
    try {
        let { videoId } = req.body

        if(!videoId) {
            return next(new ValidationError(400, "videoId is required!"))
        }

        const videos = req.readFile("videos")
        const videoIndex = videos.findIndex(video => video.videoId === videoId && video.userId === req.userId)

        if(videoIndex === -1){
            return next(new ValidationError(404,"No such as video"))
        }
        let [deleted] = videos.splice(videoIndex,1)
        fs.unlinkSync(path.join(process.cwd(), 'src',"public","videos", deleted.fileName))

        req.writeFile("videos",videos)

        return res.status(201).json({
            ok:true,
            message:"Video is deleted!"
        })
    } catch (e) {
        next(new InternalServerError(e.message))
    }
}

function GET(req, res, next){
    try {
        const { fileName } = req.params
        res.download( path.join(process.cwd(), 'src', 'public',"videos", fileName) )
    } catch(error) {
        return next(new ValidationError(400,e.message))
    }
}

module.exports = {
    POST,
    PUT,
    DELETE,
    GET,
    SEARCH,
    MYVIDEOS
}