const express = require('express');
const productModel = require('../models/productModel');
const AppError = require('../utility/appError');

// Get all products from db
exports.getAllProducts = async (req, res, next) => {
    try {
        const { page, limit, filterData } = req.query;
        console.log("page",page,'limit',limit);
        
        const count = await productModel.totalProductCount();

        const allProducts = await productModel.allProducts(limit, page, filterData);
        if (allProducts.length > 0) {
            res.status(200).json({
                massage: 'success',
                data: allProducts,
                count: count
            });
        } else {
            return next(new AppError("no data found", 401));
        }
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// Get product by id from db
exports.getProductById = async (req, res, next) => {
    try {
        const getProduct = await productModel.getProductById(req.params.id);
        if (getProduct._id) {
            res.status(200).json({
                massage: 'success',
                data: getProduct
            });
        } else {
            return next(new AppError(getProduct), 401);
        }
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// Add product to db
exports.addProductApi = async (req, res, next) => {
    try {
        const { pname, cost, userId, picture } = req.body;
        let buffer = null
        
        if(typeof picture !== undefined){
            buffer = Buffer.from(picture, 'base64');
        }
        if (!pname || !cost || !userId) {
            return next(new AppError('Please provide all inputs', 401));
        } else {
            const count = await productModel.totalProductCount();
            const addProduct = await productModel.addProductToDB(
                pname,
                buffer,
                cost,
                userId
            );
            
            if (addProduct._id) {
                const responseData = {
                    ...addProduct._doc,
                    picture: typeof addProduct.picture !== undefined && addProduct.picture
                        ? addProduct.picture.toString('base64')
                        : null,
                };
                const updatedData = {...responseData,
                    userName: responseData.userid.name,
                    userId : responseData.userid._id
                };
                res.status(200).json(
                    {
                        status: "Success",
                        data: updatedData,
                        count:count
                    }
                )
            } else {
                return next(new AppError(addProduct, 401));
            }
        };
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// edit product to database
exports.editProductApi = async (req, res, next) => {
    try {
        const { pname, picture, cost, userId } = req.body;
        const buffer = Buffer.from(picture, 'base64');
        const id = req.params.id;
        if (!id || !pname || !cost || !userId) {
            next(new AppError('All input fields are required', 401));
        }
        const count = await productModel.totalProductCount();
        const editProductResp = await productModel.editProduct(id, pname, buffer, cost, userId);
        if (editProductResp._id) {
            const responseData = {
                ...editProductResp._doc,
                picture: typeof editProductResp.picture !==undefined && editProductResp.picture
                    ? editProductResp.picture.toString('base64')
                    : null,
            };
            const updatedData = {...responseData,
                userName: responseData.userid.name,
                userId : responseData.userid._id
            };
            res.status(200).json(
                {
                    status: "Success",
                    data: updatedData,
                    count:count
                }
            );
        } else {
            return next(new AppError(editProductResp, 401));
        }
    } catch (error) {
        return next(new AppError(error, 401));
    }
};

// delete product from database
exports.deleteProductApi = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return next(new AppError('Please provide id', 401));
        }
        const getDelResponse = await productModel.deleteProduct(id);
        const count = await productModel.totalProductCount();
        console.log(getDelResponse);
        if (getDelResponse._id) {
            res.status(200).json(
                {
                    status: "Success",
                    data: getDelResponse,
                    count: count
                }
            );
        }
        if (getDelResponse === null) {
            return next(new AppError('Please provide a valid id', 401));
        }
    } catch (error) {
        return next(new AppError(error, 401));
    }
};
