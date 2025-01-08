const multer = require("multer")
const path = require("path")
const express = require("express")
const routerMulter = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + "/uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

routerMulter.post("/rasmlar", upload.single("rasm"), (req, res) => {
    console.log(req.file);    
    res.send(req.file)
})

module.exports = routerMulter