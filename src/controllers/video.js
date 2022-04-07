const {ValidationError, InternalServerError, AuthorizationError} = require("../util/error")
const path = require("path");
const fs = require("fs");

function POST(req, res, next) {
    try {
        let {Title} = req.body
        const fileName = req.file.filename
        const size = req.file.size
        if (!req.file) {
            return next(new ValidationError(400, "The video is required!"))
        }
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

        console.log(~videoIndex)
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

module.exports = {
    POST,
    PUT,
    DELETE,
}