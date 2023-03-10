const bcrypt = require('bcryptjs')
const pool = require('../dataBase/conexion')
const filteringData = require('../helper/filter')
const nodemailer = require('../helper/nodeMailer/nodeMailer')
const bienvenida = require('../helper/nodeMailer/bienvenidaCoder')

const consultar = async () => {
    const { rows: coders } = await pool.query('SELECT * FROM programadores;')
    const { rows: lenguajes } = await pool.query('SELECT * FROM lenguajes;')
    const { rows: basedatos } = await pool.query('SELECT * FROM basedatos;')
    const { rows: frameworks } = await pool.query('SELECT * FROM frameworks;')
    const programadores = filteringData(coders)
    return { programadores, lenguajes, basedatos, frameworks }
}


const crearPerfil = async obj => {
    const personalInfo = Object.values(obj.personalInformation)
    personalInfo[2] = bcrypt.hashSync(personalInfo[2])
    const parameters = personalInfo.map((x, index) => `$${index + 1}`).join(', ')
    const programmersCommand = `INSERT INTO programadores VALUES(DEFAULT, ${parameters}) RETURNING *;`
    const programmersValues = personalInfo.map(x => x)
    const { rows: result } = await pool.query(programmersCommand, programmersValues)
    const {id, email, nombre}= result[0]
    await nodemailer(bienvenida(email, nombre))

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

const perfilFreeCoder = async id => {
    const command =
    `SELECT p.id, p.nombre, p.apellido, p.foto_url, p.area, p.repositorio_url, p.resenha, p.portafolio, p.presupuesto, p.oferta_valor, p.valor_hora,
    (SELECT array_agg(l.nombre) FROM programador_lenguaje pl LEFT JOIN lenguajes l ON pl.lenguajes_id = l.id WHERE pl.programador_id = p.id) AS lenguajes,
    (SELECT array_agg(b.nombre) FROM programador_basedatos pb LEFT JOIN basedatos b ON pb.basedatos_id = b.id WHERE pb.programador_id = p.id) AS basedatos,
    (SELECT array_agg(f.nombre) FROM framework_lenguaje fl LEFT JOIN frameworks f ON fl.framework_id = f.id WHERE fl.programador_id = p.id ) AS frameworks
    FROM programadores p
    WHERE p.id = $1;`
    const value = [id]
    const { rows: data } = await pool.query(command, value)
    return data
}

module.exports = { consultar, crearPerfil, perfilFreeCoder }