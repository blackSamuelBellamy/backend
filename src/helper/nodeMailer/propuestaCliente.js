require('dotenv').config()

const propuestaCliente = (mail, nombre, id) => {
    return {
        from: process.env.MAIL,
        to: mail,
        subject: 'Nuestro FreeCoder ha respondido tu solicitud!',
        html: `<html>
            <body>
                <h1 style="text-align: center;">Hola ${nombre}!</h1>
                <p>Ya está lista la propuesta lista para que la revises</p>
                <p> tu nuevo número de propuesta es el: ${id}.</p>
                <p> Puedes revisar la propuesta<a href="https://freecoders.netlify.app/enviopropuesta/${id}>Aquí</a>.</p>
                <p>Atentamente: FreeCoders</p>
            </body>
          </html>
          `
    }
}

module.exports = propuestaCliente