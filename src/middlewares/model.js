const { InternalServerError } = require('../util/error')
const path = require('path')
const fs = require('fs')

module.exports = ({ databasePath }) => {
    return (req, _, next) => {
        try {
            req.readFile = function (fileName) {
                let buffer = fs.readFileSync(
                    path.join(databasePath, fileName + '.json'), 'UTF-8'
                )
                return JSON.parse(buffer || null) || null
            }

            req.writeFile = function (fileName, data) {
                fs.writeFileSync(
                    path.join(databasePath, fileName + '.json'),
                    JSON.stringify(data, null, 4)
                )
                return true
            }

            return next()

        } catch (error) {
            return next(new InternalServerError(500, error.message))
        }
    }
}