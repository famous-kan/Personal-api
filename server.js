require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const authRoute = require('./routes/auth-route')
const productRoute = require('./routes/products-route')
const userRoute = require("./routes/user-route") 
const cartRoute = require('./routes/cart-route')
const orderRoute = require('./routes/order-route')
const hdlError = require('./middlewares/error')
const hdlNotFound = require('./middlewares/not-found')
const {authenticate} = require('./middlewares/authenticate')



app.use(cors(
    {
        origin : "*"
    }
))
app.use(express.json())
app.use('/auth', authRoute)
app.use('/product',productRoute)
app.use('/user' , userRoute)
app.use('/cart', cartRoute)
app.use('/order', orderRoute)


app.use(hdlError)
app.use(hdlNotFound)


const port = process.env.PORT || 9000
app.listen(port,() => console.log(`This server run on port ${port}`))