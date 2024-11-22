const express = require('express')
const authRoute = express.Router()
const authController = require('../controllers/auth-controller')
const {authenticate,adminCheck} = require('../middlewares/authenticate')


authRoute.post('/register',authController.register)
authRoute.post('/login',authController.login )
authRoute.post("/current-user", authenticate ,authController.curentUser)

// authRoute.post("/current-admin",authenticate , adminCheck ,authController.curentAdmin)

module.exports = authRoute