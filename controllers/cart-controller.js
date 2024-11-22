const prisma = require("../config/prisma")
const createError = require("../utils/createError")




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
















// exports.addtocart = async(req,res,next) => {
//     try {
//         const {productId, userId, count} = req.body
        
//         if(!(productId && userId)){
//             return createError(400, 'Put all data')
//         }
//         const foundProduct = await prisma.product.findUnique({
//             where: {
//                 id : +productId
//             }
//         })
        
//         if(!foundProduct){
//             return createError(404, 'Product not found')
//         }

//         const price = foundProduct.price

//         const addedProduct = await prisma.cart.create({
//             data: {
//                 productId,
//                 userId,
//                 count: 1,
//                 price : +price
//             }
//         })


//         res.json(addedProduct)
//     } catch (err) {
//         console.log(err)
//         next(err)
//     }
// }