const Joi = require("joi")
const { ClientError } = require("./error");
const {ValidationError} = require('./error')

const validate = Joi.object({
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,}$/),
})

const registerSchema = (req, res, next) => {
    const { value, error } = validate.validate(req.body)

    if(error) return next( new ValidationError(400, error.details[0].message) )

    return next()
}

module.exports = {
    registerSchema
}