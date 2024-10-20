const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user-controller')
const {authenticate, adminCheck} = require('../middlewares/authenticate')
const uploadMulter = require('../middlewares/upload-multer')


userRouter.patch('/',authenticate, uploadMulter.single('image') , userController.editUserdata)

userRouter.get('/member',authenticate, adminCheck, userController.getAlluser )
userRouter.patch('/member/:memberId',authenticate, adminCheck , userController.updateUser)
userRouter.delete('/member/:memberId',authenticate,adminCheck , userController.deleteUser)


module.exports = userRouter

