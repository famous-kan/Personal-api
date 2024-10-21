const createError = require('../utils/createError')
const prisma = require('../config/prisma')
const bcrypt =  require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const path = require('path')
const fs = require('fs/promises')


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


exports.editUserdata = async(req,res,next) => {
    try {
        const { firstName,lastName,id} = req.user
        const password = req.pass
        const {newPassword,newConfirmPassword,newFirst,newLast,newIdentity} = req.body
        
        if(newPassword && newPassword !== newConfirmPassword){
            return createError(400,'Password is not matched')
        }   
        
        const oldIdentity = req.user.email || req.user.mobile

        let curIdentity = newIdentity || oldIdentity
        let curpassword = password
        

        const identityKey = checkEmailorPhone(curIdentity)

        if(newIdentity){

            const isIdentityExist = await prisma.user.findUnique({
                where: {
                    [identityKey] : newIdentity
                }
            })
            
            if(isIdentityExist){
                return createError(400,'This user already used')
            }
        }
        
        if (newPassword){
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            curpassword = hashedPassword
            console.log(curpassword)
        }
        const havefile = !!req.file
        let uploadResult = {} 
        const userData = await prisma.user.findUnique({
            where : {
                id : +id
            }
        })
        if(havefile){
            console.log(cloudinary.uploader)
             uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite : true,
                public_id :path.parse(req.file.path).name
                
            })
            fs.unlink(req.file.path)
        }
        
        const prvImg = userData.image
        const editUser = await prisma.user.update({
            where: {
                id : +id
            },
            data: {
                [identityKey] : curIdentity , 
                password : curpassword,
                firstName : newFirst || firstName,
                lastName : newLast || lastName,
                profileImage : uploadResult.secure_url || prvImg,
            }
        })
        
        res.json({message: 'Updated successfully', editUser})
    } catch (err) {
        next(err)
    }
}


exports.getAlluser = async(req,res,next) => {
    try {
    const alluser = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            mobile: true,
            role: true,
        }
    })
    const identityArray = alluser.map((el) => {
        return ({...el,"identity":el.email||el.mobile})
    })
    res.json(identityArray)
    } catch (err) {
        next(err)
    }
}

exports.updateUser = async(req,res,next) => {
    try {
        const {memberId} = req.params
        const {role} = req.body 
        const getRole = await prisma.user.update({
            where: {
                id : +memberId
            }, 
            data: {
                role : role
            }
        })
        res.json(getRole)
    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async(req,res,next) => {
    try {
        const {memberId} = req.params
        const deleteUser = await prisma.user.delete({
            where: {
                id: +memberId
            }
        })
        console.log(deleteUser)
        res.json(deleteUser)

    } catch (err) {
        next(err)
    }
}