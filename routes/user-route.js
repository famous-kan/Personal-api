const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user-controller')
const {authenticate} = require('../middlewares/authenticate')
const uploadMulter = require('../middlewares/upload-multer')


userRouter.patch('/',authenticate, uploadMulter.single('image') , userController.editUserdata)


// userRouter.get("/users", )
// userRouter.post("/changeStatus", )
// userRouter.post("/changeRole", )


// userRouter.post("/cart", )
// userRouter.get("/cart", )
// userRouter.delete("/cart", )

// userRouter.post("/address", )

// userRouter.post("/order", )
// userRouter.get("/order", )

module.exports = userRouter

