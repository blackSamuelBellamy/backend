require('dotenv').config()

const propuestaCliente = (mail, nombre, id) => {
    return {
        from: process.env.MAIL,
        to: mail,
        subject: 'Felicidades! tu propuesta fué enviada al cliente',
        html: `<html>
            <body>
                <h1 style="text-align: center;">Hola ${nombre}!</h1>
                <p>Ahora solo esperar a que el cliente acepte la propuesta enviada</p>
                <p>el número de propuesta es el: ${id}.</p>
                <p>Atentamente: FreeCoders</p>
            </body>
          </html>
          `
    }
}

module.exports = propuestaCliente