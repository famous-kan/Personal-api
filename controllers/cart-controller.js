const prisma = require("../config/prisma")
const createError = require("../utils/createError")




exports.addtocart = async(req,res,next) => {
    try {
        const {productId, userId, count} = req.body
        
        if(!(productId && userId)){
            return createError(400, 'Put all data')
        }
        const foundProduct = await prisma.product.findUnique({
            where: {
                id : +productId
            }
        })
        
        if(!foundProduct){
            return createError(404, 'Product not found')
        }

        const price = foundProduct.price

        const addedProduct = await prisma.cart.create({
            data: {
                productId,
                userId,
                count: 1,
                price : +price
            }
        })


        res.json(addedProduct)
    } catch (err) {
        console.log(err)
        next(err)
    }
}


exports.getCartbyId = async(req,res,next) => {
    try {
        const {productId} =req.body 
        if(!productId){
            return createError(400,'Put all input')
        }
        const numberArray = productId.map(item => +item)
        const getCart = await prisma.product.findMany({
            where: {
                id : {
                    in : numberArray
                }
            }
        })
        res.json(getCart)
    } catch (err) {
        next(err)
    }
}

// exports.userCart = async(req,res,next) => {
//     try {
//         const {userId,shoppingCart} = req.body

//         const isUserExist = await prisma.user.findUnique({
//             where: {
//                id : +userId
//             }
//         })

//         if(!isUserExist){
//             console.log(isUserExist)
//             return createError(400,' invalid user')
//         }

//         if(shoppingCart.length === 0 ){
//             return createError(400, 'No data')
//         }
//         const productSet = new Set()
//         for (let product of shoppingCart){
//             const productFound = await prisma.product.findUnique({
//                 where : {
//                     id : +product.productId
//                 }
//             })
//             if (!productFound){
//                 return createError(400, 'No product')
//             }
//             product.price = productFound.price
//             product.userId = userId
//             if (productSet.has(product.productId)){
//                 return createError(400,"Duplicated product")
//             }
//             productSet.add(product.productId)

//         }
//         const addedProducts = await prisma.cart.createMany({
//             data: shoppingCart,
//         });
//         res.json(addedProducts)
//     } catch (err) {
//         next(err)
//     }
// }

// exports.deleteUsercart = async(req,res,next) => {
//     try {
//         const {userId} = req.body
//         await prisma.cart.deleteMany({
//             where : {
//                 userId : +userId
//             }
//         })
//         res.json('remove product')

//     } catch (err) {
//         next(err)
//     }
// }