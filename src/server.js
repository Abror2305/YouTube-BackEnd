const express = require("express")
const app = express()
const { PORT } = require("../config")
const routers = require("./routes")
const fs = require("fs");
const path = require("path");
const model = require("./middlewares/model")
const multer = require("multer")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(process.cwd(),"src","public")))
app.use(model({databasePath:path.join(__dirname, 'database')}))
app.use(routers)

app.use((error, req, res, next) => {

    if (error instanceof multer.MulterError){
        return res.status(400).json(
        {
            ok:false, message: error.message
        }
        )
    }
    if(+error.status !== 500) {
        return res.status(error.status).json(
            {
                ok:false,
                message: error.message
            }
        )
    }

    fs.appendFileSync(
        path.join(process.cwd(), 'log.txt'),
        `${Date.now()}  ${req.method}  ${req.url}  "${error.message}"\n`
    )

    return res.status(500).json({
        ok:false,
        message: "Internal Server Error"
    })
})

app.listen(PORT,() => console.log("server is running at "+PORT))