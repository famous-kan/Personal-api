const express = require('express')
const userRouter = express.Router()


userRouter.get("/users", )
userRouter.post("/changeStatus", )
userRouter.post("/changeRole", )


userRouter.post("/cart", )
userRouter.get("/cart", )
userRouter.delete("/cart", )

userRouter.post("/address", )

userRouter.post("/order", )
userRouter.get("/order", )

module.exports = userRouter

