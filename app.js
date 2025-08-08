const express = require('express');
const app = express()
const productRouter = require('./route/router')
const mongoose = require('mongoose')

require("dotenv").config();
const brandRoute = require('./route/brandRoute')
const authRouter = require('./route/userRouter.js')
app.use(express.json())


mongoose.connect(process.env.DB_URL).then(() => {
    console.log('connect to database');
}).catch((err) => {
    console.log('An error have occur ', err);
})
app.use('/brands', brandRoute);
app.use('/auth', authRouter);
app.use('/product', productRouter);

app.listen(3000, () => {
    console.log('server started on port 3000');
})