const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');

// get products
router.get('/allProducts',productController.getAllProducts);
router.get('/product/:id',productController.getProductById);

// product crud operation controllers
router.post('/addProduct',productController.addProductApi);
router.patch('/editProduct/:id',productController.editProductApi);
router.delete('/deleteProduct/:id', productController.deleteProductApi);

module.exports = router;