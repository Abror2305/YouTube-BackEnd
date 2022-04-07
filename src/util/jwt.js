const JWT = require('jsonwebtoken')
const secret_key = "olmajon"

module.exports = {
    sign: payload => JWT.sign(payload, secret_key),
    verify: token => JWT.verify(token, secret_key),
}