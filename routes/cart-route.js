const express = require('express')
const cartRoute = express.Router()
const cartController = require('../controllers/cart-controller')
const {authenticate} = require('../middlewares/authenticate')


cartRoute.post('/',cartController.addtocart)
cartRoute.post('/id',cartController.getCartbyId)
// cartRoute.post('/userCart',authenticate, cartController.userCart)
// cartRoute.delete('/userCart',authenticate, cartController.deleteUsercart)





module.exports = cartRoute