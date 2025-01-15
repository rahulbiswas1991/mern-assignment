const express = require('express');
const userModel = require('./../models/userModel');
const AppError = require('../utility/appError');
const moment = require('moment');

// Get all users from db
exports.getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, showAll } = req.query;
        const count = await userModel.totalCount();
        const show = showAll && false;
        const allUsers = await userModel.allUsers(limit, page, show);
        if (allUsers.length > 0) {
            res.status(200).json({
                massage: 'success',
                data: allUsers,
                count: count
            });
        } else {
            return next(new AppError("no data found", 401));
        }
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// Get user by id from db
exports.getUserById = async (req, res, next) => {
    try {
        const getUser = await userModel.getUserById(req.params.id);
        if (getUser._id) {
            res.status(200).json({
                massage: 'success',
                data: getUser
            });
        } else {
            return next(new AppError(getUser), 401);
        }
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// Add user to db
exports.addUserApi = async (req, res, next) => {
    try {
        const { name, email, dob } = req.body;
        console.log(name);
        if (!name || !email || !dob) {
            return next(new AppError('Please provide all inputs', 401));
        } else {         
            const addUserToDB = await userModel.addUser(
                name,
                email,
                dob
            );
            const count = await userModel.totalCount();
            if (addUserToDB._id) {
                res.status(200).json(
                    {
                        status: "Success",
                        data: addUserToDB,
                        count: count
                    }
                )
            } else {
                return next(new AppError(addUserToDB, 401));
            }
        };
    } catch (error) {
        next(new AppError(error, 401));
    }
};

// edit user to database
exports.editUserApi = async (req, res, next) => {
    try {
        const { name, email, dob } = req.body;
        const id = req.params.id;
        if (!id || !name || !email || !dob) {
            next(new AppError('All input fields are required', 401));
        }
        const editUser = await userModel.editUser(id, name, email, dob);
        const count = await userModel.totalCount();
        console.log("editUser", editUser);
        if (editUser._id) {
            res.status(200).json(
                {
                    status: "Success",
                    data: editUser,
                    count: count
                }
            );
        } else {
            return next(new AppError(editUser, 401));
        }
    } catch (error) {
        return next(new AppError(error, 401));
    }
};

// delete user from database
exports.deleteUserApi = async (req, res, next) => {
    console.log("testing delete user");
    
    try {
        const id = req.params.id;
        console.log("id",id);
        
        if (!id) {
            return next(new AppError('Please provide id', 401));
        }
        const getDelResponse = await userModel.deleteUser(id);
        const count = await userModel.totalCount();
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
