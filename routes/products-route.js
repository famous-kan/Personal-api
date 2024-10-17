const express = require('express')
const productRoute = express.Router()
const productController = require('../controllers/product-controller')
const {authenticate} = require('../middlewares/authenticate')

const uploadMulter = require('../middlewares/upload-multer')


productRoute.post('/',authenticate, uploadMulter.single('image'), productController.create)
productRoute.patch('/:id',authenticate, uploadMulter.single('image') , productController.update)
productRoute.get('/:count/:page', productController.getProducts)
productRoute.delete('/:id', productController.delete)
productRoute.post('/productby', productController.listby)
productRoute.post('/search/filters', productController.searchFilters )




module.exports = productRoute