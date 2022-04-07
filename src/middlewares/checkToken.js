const { AuthorizationError, InternalServerError} = require('../util/error')
const { verify } = require('../util/jwt')

module.exports = (req, res, next) => {
    try {
        const { token } = req.headers

        if(!token) {
            return next(new AuthorizationError(401, "user is not authorized!"))
        }

        const { userId, agent } = verify(token)

        if(!(req.headers['user-agent'] === agent)) {
            return next(new AuthorizationError(401, "Token is invalid!"))
        }

        const users = req.readFile('users')
        let user = users.find(user => user.userId === userId)

        if(!user) {
            return next(AuthorizationError(401, "The token is invalid!"))
        }

        req.userId = userId

        return next()
    } catch(error) {
        return next(new AuthorizationError(error.message))
    }
}
