const express = require('express')
const orderRoute = express.Router()
const orderController = require('../controllers/order-controller')
const uploadMulter = require('../middlewares/upload-multer')

orderRoute.post('/',uploadMulter.single('image'), orderController.placeOrder)
orderRoute.post('/product', orderController.productOnOrder)

module.exports = orderRoute