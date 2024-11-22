const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken")

module.exports.authenticate = async(req,res,next) => {

    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith('Bearer')){
            createError(401, 'Unauthorizeddd')
        }
    
        
        const token = authorization.split(' ')[1]
        if(!token){
            createError(401, 'Unauthorized')
        }
       
        
        const payload = jwt.verify(token, process.env.SECRET)

        const foundUser = await prisma.user.findFirst({
            where : {id: payload.user.id}
        })
        if(!foundUser){
            createError(401, 'Unauthorized')
        }
        
        const { password , createdAt, updatedAt, ...userData } = foundUser
        req.user = userData
        req.pass = password

        next()

    } catch (err) {
        next(err)
    }

}

module.exports.adminCheck = (req,res,next) => {
    try {
        if (req.user.role !== "ADMIN"){
            return createError(403,"Unauthorized")
        }
        next()
    } catch (err) {
        next(err)
    }
}