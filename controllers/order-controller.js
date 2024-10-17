const createError = require("../utils/createError")
const prisma = require("../config/prisma")
const cloudinary = require('../config/cloudinary')
const path = require('path')
const fs = require('fs/promises')



exports.placeOrder = async(req,res,next) => {
    try {
    
        let {address, paymentMethod, total, userId} = req.body

        total = +total

        if(!address.trim()) {
            return createError(400,'Please fill all data')
        }
        
        if(!paymentMethod){
            return createError(400, 'Please put data/select data')
        }
        
        
        if(paymentMethod !== "CASH" && paymentMethod !== "ONLINE_BANKING" ){
            return createError(400, 'Invalid Payment medthod')
        }
        
        const havefile = !!req.file
        
        if((paymentMethod === "ONLINE_BANKING") && !havefile){
            return createError(400, "Please provided image transaction")
        }
        let uploadResult = {} 
        if(havefile){
            console.log(cloudinary.uploader)
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite : true,
                public_id :path.parse(req.file.path).name
                
            })
            fs.unlink(req.file.path)
        }
    

        if(!total || (typeof total) !== 'number'){
            
            return createError(400, 'No order')
        }
        if(!userId){
            return createError(400, 'Invalid order')
        }


        const userExist = await prisma.user.findFirst({
            where: {
                 id : +userId
            }
        })

        if(!userExist){
            return createError(400,'User not exist in database')
        }
        
        const order = await prisma.orders.create({
            data: {
                delivery_address:  address,
                payment_method : paymentMethod,
                cartTotal : total,
                userId : +userId,
                imageTransaction : uploadResult.secure_url,
                is_paid: false
            }
        })

        res.json(order)
    } catch (err) {
        next(err)
    }
}

exports.productOnOrder = async(req,res,next) => {

    try {
        const {orderId, shoppingCart} = req.body
        
        if(!orderId){
            return createError(400, "No order")
        }

        const findOrderId = await prisma.orders.findFirst({
            where: {
                id : +orderId
            }
        })
        if(!findOrderId){
            return createError(404, "Not found")
        }
        
        if(!shoppingCart){
            return createError(400, 'No shopping cart')
        }
        if(shoppingCart.length === 0){
            return createError(400, 'No shopping cart')
        }

        for (let item of shoppingCart ){
            console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",item)
            let findProduct = await prisma.product.findUnique({
                where: {
                    id : +item.productId
                }
            })
            if(!findProduct){
                return createError(400, "Invalid product id")
            }
        }

        const cartItem = shoppingCart.map((el) => ({
            productId : el.productId,
            count: el.count,
            price : el.price,
            orderId : orderId
        }) )

        const createProduct = await prisma.productOnOrder.createMany({
            data: cartItem,
        })
        res.json(createProduct)


    } catch (err) {
        console.log(err)
        next(err)
    }
}