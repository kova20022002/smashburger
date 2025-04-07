const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers.js')

router.post('/signup', controller.postUser);

router.post('/login', controller.loginUser);

router.post('/logout', controller.logoutUser);

router.get('/auth-check', controller.authCheck);

router.get('/products', controller.getProducts);

router.post('/place-order', controller.authenticateUser,controller.placeOrder);

router.get('/admin', controller.authCheck, controller.isAdmin);

router.get('/orders', controller.getOrdersAdmin);

router.post('/change-order-status', controller.changeOrderStatus);

router.post('/delivering', controller.changeOrderStatusToDelivering);

router.post('/canceled', controller.changeOrderStatusToCanceled);

router.get('/order-history', controller.authenticateUser, controller.getOrderHistory);

router.post('/profile', controller.saveUserInfo);

router.get('/getUserInfo', controller.getUserInfo);

module.exports = router;