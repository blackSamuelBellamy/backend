const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
    host: 'smt.office365.com',
    port: 587,
    service: process.env.SERVICE,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

const nombre = 'Stranger' // coloca tu nombre aquí

const mailOptions = {
    from: process.env.MAIL,
    to: '' , // si quieres probar coloca aquí tu email entre las comillas
    subject: 'Te damos la bienvenida a Freecoders!',
    html: `<html>
            <body>
                <h1 style="text-align: center;">Hola ${nombre}</h1>
                <p style="text-align: center;">Gracias por unirte a nuestro equipo, aquí tendrás una extensa vitrina para ayudarte en tu carrera como coder</p>
            </body>
          </html>
          `
}

const sendingMail = () => {
    transporter.sendMail(mailOptions, (err, info) => 
    err ? console.log(err): console.log(`Proceso exitoso ${info.response}`))
}

module.exports = sendingMail