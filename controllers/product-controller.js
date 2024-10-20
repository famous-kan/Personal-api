const prisma = require("../config/prisma")
const cloudinary = require('../config/cloudinary')
const path = require('path')
const fs = require('fs/promises')
const createError = require("../utils/createError")


exports.create = async(req,res,next) => {
    try {
        const {title, description, price, image } = req.body
        const havefile = !!req.file
        let uploadResult = {} 
        if(havefile){
            console.log(cloudinary.uploader)
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite : true,
                public_id :path.parse(req.file.path).name
                
            })
            fs.unlink(req.file.path)
        }
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price : parseFloat(price),
                image : uploadResult.secure_url || '',
            }
        })

        res.json({message :"Create Successful", product })
    } catch (err) {
        console.log(err)
    }
} 
exports.update = async(req,res,next) => {
    try {
        const {id} = req.params
        const {title, description, price, image } = req.body
        const havefile = !!req.file
        let uploadResult = {} 
        const productData = await prisma.product.findUnique({
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
        const priceVal = parseFloat(price) || undefined
        const prvImg = productData.image
        const product = await prisma.product.update({
            where: {
                id : +(req.params.id)
            },
            data: {
                title,
                description,
                price : priceVal,
                image : uploadResult.secure_url || prvImg,
            }
        })

        res.json({message :"Update Successful", product })
    } catch (err) {
        console.log(err)
    }
} 
exports.getProducts = async(req,res,next) => {
    try {
        const {count,page} = req.params
        const getproducts = await prisma.product.findMany({
            take :parseInt(count),
            orderBy : {createdAt : "desc"},
            skip : ((+page)-1)*count
        })
        if (getproducts.length === 0){
            throw new Error("No data found");
        }
        res.json(getproducts)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
} 
exports.delete = async (req,res,next) => {
    try {
        const {id} = req.params
        
        await prisma.product.delete({
            where : {
                id : +id
            }
        })
        res.json('remove product')
    } catch (err) {
        console.log(err)
    }
} 



exports.listby = async(req,res,next) => {
    try {
        const {sort, order, limit} = req.body

        const products = await prisma.product.findMany({
            take : limit,
            orderBy : {[sort]: order}
    
        }) 
        

        res.json(products)
    } catch (err) {
        console.log(err)
    }
} 

const hdlQuery = async(req,res,query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query
                },
               
            }
        })
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: "Search error" })
     next(err)   
    }
}



exports.searchFilters = async(req,res,next) => {
    try {
        const {query,price} = req.body

        if(query){
            console.log(query, "QUEEERRRYYY")
            await hdlQuery(req,res,query)
        }
        if(price){
            console.log(price, "priceeeeeeeeeeeee")
            
        }

        // res.json(getproducts)
    } catch (err) {
        res.status(404).json({ error: err.message })
    }
} 