require('dotenv').config()

const solicitudCreada = (mail, nombre, id) => {
    return {
        from: process.env.MAIL,
        to: mail,
        subject: 'Tienes una solicitud de trabajo!',
        html: `<html>
            <body>
                <h1 style="text-align: center;">Hola ${nombre}!</h1>
                <p>Tienes una propuesta de trabajo, recuerda que tienes 7 días para contactarte con el cliente</p>
                <p> Número de propuesta: ${id}.</p>
                <p>Mucha suerte!</p>
            </body>
          </html>
          `
    }
}

module.exports = solicitudCreada