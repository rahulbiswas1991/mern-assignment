const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');

// get users
router.get('/allUsers',userController.getAllUsers);
router.get('/user/:id',userController.getUserById);

// user crud operation controllers
router.post('/addUser',userController.addUserApi);
router.patch('/editUser/:id',userController.editUserApi);
router.delete('/deleteUser/:id', userController.deleteUserApi);

module.exports = router;