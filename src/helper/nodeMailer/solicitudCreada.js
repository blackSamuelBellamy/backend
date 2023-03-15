require('dotenv').config()

const solicitudCreada = (mail, nombre, id) => {
    return {
        from: process.env.MAIL,
        to: mail,
        subject: 'Gracias por aplicar en nuestra pagina',
        html: `<html>
            <body>
                <h1 style="text-align: center;">Hola ${nombre}!</h1>
                <p>El coder se contacatará contigo en un plazo de 7 días para evaluar la propuesta</p>
                <p>tu número de propuesta es: ${id}.</p>
                <p>Gracias por preferirnos</p>
            </body>
          </html>
          `
    }
}

module.exports = solicitudCreada