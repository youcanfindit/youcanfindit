//Nodemailer from config

const nodemailer = require('nodemailer');

//Gmail transporter
let transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

module.exports = {
    transport
}
