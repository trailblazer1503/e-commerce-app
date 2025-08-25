const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: "gmail.com",
    host: "smtp.gmail.com",
    auth: {
        user: "adeniyijoshua010@gmail.com",
        pass: "bxdgjzwwshaelvuh"
    },
    secure: true,
    port: 465

});

module.exports = transport;