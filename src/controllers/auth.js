const sha256 = require('sha256')
const {AuthorizationError, InternalServerError, ValidationError} = require("../util/error");
const {sign} = require("../util/jwt");

function REGISTER(req,res,next){
    try{
        if(!req.file) return next(
            new ValidationError(400, 'Please upload a image')
        )
        const users = req.readFile("users")
        req.body.userId = users.length ? users.at(-1).userId + 1 : 1
        req.body.password = sha256(req.body.password)
        req.body.avatar = req.file.filename
        if (users.find(user => user.username === req.body.username)) {
            return next(
                new AuthorizationError(400, 'The user already exists')
            )
        }

        users.push(req.body)
        req.writeFile('users', users)
        const agent = req.headers['user-agent']
        delete req.body.password
        return res.status(201).json({
            ok:true,
            message: 'The user successfully registered!',
            user: req.body,
            token: sign({ agent,userId: req.body.userId })
        })
    }catch (e) {
        return next(new InternalServerError(500,e.message))
    }
}

function LOGIN(req,res,next){
    try {
        const users = req.readFile('users') || []

        req.body.password = sha256(req.body.password)
        const user = users.find(user => user.username === req.body.username && user.password === req.body.password)

        if (!user) {
            return next(
                new AuthorizationError(400, 'Wrong username or password!')
            )
        }

        const agent = req.headers['user-agent']

        return res.status(200).json({
            ok: true,
            message: 'The user successfully logged in!',
            user,
            token: sign({ agent, userId: user.userId })
        })
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}
module.exports = {
    REGISTER,
    LOGIN
}