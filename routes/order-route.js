const express = require('express')
const orderRoute = express.Router()
const orderController = require('../controllers/order-controller')
const uploadMulter = require('../middlewares/upload-multer')
const { authenticate, adminCheck } = require('../middlewares/authenticate')

orderRoute.post('/', authenticate,uploadMulter.single('image'), orderController.placeOrder)
orderRoute.post('/product', orderController.productOnOrder)
orderRoute.get('/', authenticate, orderController.getOrder)
orderRoute.get('/all', authenticate, adminCheck, orderController.getAllorder)
orderRoute.patch('/all', authenticate, adminCheck, orderController.delistatus )

module.exports = orderRoute