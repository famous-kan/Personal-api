const createError = require('../utils/createError')
const prisma = require('../config/prisma')
const bcrypt =  require('bcryptjs')
const jwt = require('jsonwebtoken')


function checkEmailorPhone(identity) {
    let identityKey = ''
    if(/^[0-9]{10,15}$/.test(identity)) {
     identityKey = 'mobile'
    }
    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity)) {
     identityKey = 'email'
    }
    if(!identityKey) {
     createError(400, 'only email or phone number')
    }
    return identityKey
   }



exports.register = async(req,res,next) => {
    try {
    const {identity , firstName, lastName, password , confirmPassword} = req.body
    if(!(identity.trim() && firstName.trim() && lastName.trim() && password && confirmPassword )){
        return createError(400,'Please fill all data')
    }
    
    if(password !== confirmPassword){
        return createError(400,'Password is not matched')
    }
    
    const identityKey = checkEmailorPhone(identity)

    const isIdentityExist = await prisma.user.findUnique({
        where: {
            [identityKey] : identity
        }
    })

    if(isIdentityExist){
        return createError(400,'This user already exist')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await prisma.user.create({
        data: {
            [identityKey] : identity,
            password : hashedPassword,
            firstName,
            lastName,
        }
    })

    res.json({message: 'Register successfully', newUser})

    } catch (err) {
        next(err)
    }
}


exports.login = async(req,res,next) => {
    try {
        const {identity, password} = req.body

        if(!(identity.trim() || password.trim())){
            return createError(400, 'Please fill the data')
        }

        const identityKey = checkEmailorPhone(identity)

        const isUserExist = await prisma.user.findUnique({
            where: {
                [identityKey] : identity
            }
        })

        if(!isUserExist){
            console.log(isUserExist)
            return createError(400,' invalid login')
        }
        //check password
        const isMatchPassword = await bcrypt.compare(password, isUserExist.password)

        if(!isMatchPassword){
            return createError(401, "invalid login")
        }

        const payload = {
            user: {
                id: isUserExist.id,
            }
        }
        
        const token = jwt.sign(payload , process.env.SECRET, {
            expiresIn: '30d'
        })

        const {password : pw, createdAt, updatedAt, ...userData} = isUserExist

         res.json({token , user: userData})
    } catch (err) {
        next(err)
    }
}



exports.curentUser = (req,res,next) => {
    try {
        res.json(req.user)
    } catch (err) {
        next(err)
    }
}

exports.curentAdmin = async(req,res,next) => {
    try {
        res.json('Current Admin')
    } catch (err) {
        next(err)
    }
}