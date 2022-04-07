class InternalServerError extends Error {
    constructor(message) {
        super()
        this.status = 500
        this.message = "Internal Server Error: " + message
    }
}

class ValidationError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'ValidationError'
        this.message = message
    }
}

class AuthorizationError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.name = 'AuthorizationError'
        this.message = message
    }
}


module.exports = {
    ValidationError,
    AuthorizationError,
    InternalServerError
}