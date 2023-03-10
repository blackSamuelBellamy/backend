// Este archivo index solo sirve para emular el post del front cuando el coder ingrese sus datos, le llegará un correo de bienvenida
// se pueden hacer pruebas para testear, pero en producción se elminará este archivo.
// puedes ir al archivo post.js en helper para cambiar tanto el correo como el nombre para revisar tu email en carpeta no deseado.
const bcrypt = require('bcryptjs')
const write = require('./src/helper/post')
const pool = require('./src/dataBase/conexion')
const nodemailer = require('./src/helper/nodeMailer/nodeMailer')
const bienvenida = require('./src/helper/nodeMailer/bienvenidaCoder')

const crearPerfil = async obj => {
    const personalInfo = Object.values(obj.personalInformation)
    personalInfo[2] = bcrypt.hashSync(personalInfo[2])
    const parameters = personalInfo.map((x, index) => `$${index + 1}`).join(', ')
    const programmersCommand = `INSERT INTO programadores VALUES(DEFAULT, ${parameters}) RETURNING *;`
    const programmersValues = personalInfo.map(x => x)
    const { rows: result } = await pool.query(programmersCommand, programmersValues)
    const {id, email, nombre}= result[0]
    await nodemailer(bienvenida(email,nombre))

    const skills = async (main_table, create_table, id) => {
        const { rows: result } = await pool.query(`SELECT * FROM ${main_table}`)
        const skill = result.filter(sk => obj[main_table].includes(sk.nombre))
        const skillCommand = `INSERT INTO ${create_table} VALUES (DEFAULT, $1, $2)`
        for (const index in skill) {
            const value = [id, skill[index].id]
            await pool.query(skillCommand, value)
        }
    }
    await skills('lenguajes', 'programador_lenguaje', id)
    await skills('frameworks', 'framework_lenguaje', id)
    await skills('basedatos', 'programador_basedatos', id) 
}

crearPerfil(write) 