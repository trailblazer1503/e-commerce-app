const express = require('express')
const authController = require('../Controller/authController')
const userRoute = express.Router();

userRoute.post('/register', authController.register )

userRoute.post('/login', authController.login)



module.exports = userRoute;