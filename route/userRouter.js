const express = require('express')
const authController = require('../Controller/authController')
const userRoute = express.Router();
const checkIfLoggedIn = require('../middleware/authlogin')
userRoute.post('/register', authController.register )

userRoute.post('/login', authController.login)
userRoute.get('/profile', checkIfLoggedIn, authController.getProfile)


module.exports = userRoute;

