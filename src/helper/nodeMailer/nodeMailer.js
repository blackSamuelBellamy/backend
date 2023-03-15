require('dotenv').config()
const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }, 
    tls: {
        rejectUnauthorized: false
    }
})

const sendingMail = async mailOptions => {
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        }else{
            console.log('Correo electrónico enviado: ' + info.response);
        }
    })
}

module.exports = sendingMail