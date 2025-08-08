const express = require('express')
const brandRouter = express.Router();
const brandController = require('../Controller/brandController');
const checkIfLoggedIn = require('../middleware/authlogin');
const adminMiddleware = require('../middleware/isAdmin')

brandRouter.post('/', checkIfLoggedIn, adminMiddleware, brandController.createBrand)
brandRouter.put('/:id', checkIfLoggedIn, adminMiddleware, brandController.updateBrand)
brandRouter.delete('/:id', checkIfLoggedIn, adminMiddleware, brandController.deleteBrand)
brandRouter.get('/', brandController.getBrands)



module.exports = brandRouter;