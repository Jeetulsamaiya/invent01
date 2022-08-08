const express = require('express')
const userRouter = require('./Router/userRouter')
require('./db/db')
// 
const app = express()
app.use(express.json())
app.use(userRouter)
app.use(express.urlencoded({extended : false}))
let port = 3000 
app.listen(port, () => {
    console.log(`connected to server on port ${port}`)
} )