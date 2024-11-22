const express = require('express')
const productRoute = express.Router()
const productController = require('../controllers/product-controller')
const {authenticate, adminCheck} = require('../middlewares/authenticate')

const uploadMulter = require('../middlewares/upload-multer')


productRoute.post('/',authenticate, adminCheck ,uploadMulter.single('image'), productController.create)
productRoute.patch('/:id',authenticate, adminCheck ,uploadMulter.single('image') , productController.update)
productRoute.get('/:count/:page', productController.getProducts)
productRoute.delete('/:id', productController.delete)
productRoute.post('/search/filters', productController.searchFilters )
//productRoute.post('/productby', productController.listby)

module.exports = productRoute