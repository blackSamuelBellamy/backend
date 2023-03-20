const bcrypt = require('bcryptjs')
const pool = require('../dataBase/conexion')
const uploadImage = require('../helper/uploadImage')
const nodemailer = require('../helper/nodeMailer/nodeMailer')
const bienvenida = require('../helper/nodeMailer/bienvenidaCoder')
const solicitudCreada = require('../helper/nodeMailer/solicitudCreada')
const solicitudProgramador = require('../helper/nodeMailer/solicitudProgramador')
const propuestaCliente = require('../helper/nodeMailer/propuestaCliente')
const propuestaCoder = require('../helper/nodeMailer/propuestaCoder')

const consultar = async () => { 
    const command =
       `SELECT p.id, p.nombre, p.apellido, p.foto_url, p.area, p.repositorio_url, p.resenha, p.portafolio, p.presupuesto, p.oferta_valor, p.valor_hora,
       (SELECT array_agg(l.nombre) FROM programador_lenguaje pl LEFT JOIN lenguajes l ON pl.lenguajes_id = l.id WHERE pl.programador_id = p.id) AS lenguajes,
       (SELECT array_agg(b.nombre) FROM programador_basedatos pb LEFT JOIN basedatos b ON pb.basedatos_id = b.id WHERE pb.programador_id = p.id) AS basedatos,
       (SELECT array_agg(f.nombre) FROM framework_lenguaje fl LEFT JOIN frameworks f ON fl.framework_id = f.id WHERE fl.programador_id = p.id ) AS frameworks
       FROM programadores p`

    const { rows: main } = await pool.query(command)
    const { rows: total_lenguajes } = await pool.query('SELECT * FROM lenguajes;')
    const { rows: total_basedatos } = await pool.query('SELECT * FROM basedatos;')
    const { rows: total_frameworks } = await pool.query('SELECT * FROM frameworks;')
    const mainData = [main, total_lenguajes, total_basedatos, total_frameworks]
    return mainData
}


const crearPerfil = async obj => { 
    const personalInfo = Object.values(obj.personalInformation)
    const validationCommand = 'SELECT * FROM programadores WHERE email = $1'
    const valueValidation = [personalInfo[5]]
    const { rowCount } = await pool.query(validationCommand, valueValidation)
    if(rowCount) throw new Error('Este correo electrónico ya está registrado')
    personalInfo[2] = bcrypt.hashSync(personalInfo[2])
    personalInfo[3] =  await uploadImage(personalInfo[3])
    const programmersCommand =
        'INSERT INTO programadores VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;'
    const { rows: result } = await pool.query(programmersCommand, personalInfo)
    const { id, email, nombre } = result[0]
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

const contactarCoder = async obj => { 
    const values = Object.values(obj[0])
    const command =
        'INSERT INTO solicitudes VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, DEFAULT) RETURNING *'
    const { rows: result } = await pool.query(command, values)
    if(!result) throw new Error('Hubo un problema, intenta en un momento')
    const { nombre_cliente, apellido, email: email_cliente, id: id_solicitud, programador_id } = result[0]
    const clientCommand = 'INSERT INTO clientes (nombre, apellido, email) VALUES ($1, $2, $3);'
    const clientValues = [nombre_cliente, apellido, email_cliente]
    const { rows: datos, rowCount } = await pool.query('SELECT * FROM clientes')
    if (rowCount > 0) {
        const result = datos.find(x => x.email === email_cliente)
        if (result === undefined) {
            await pool.query(clientCommand, clientValues)
        }
    } else {
        await pool.query(clientCommand, clientValues)
    }

    const programadorID = [programador_id]
    const command_programador = 'SELECT * FROM programadores WHERE id = $1'
    const { rows: data } = await pool.query(command_programador, programadorID)
    const { nombre: programador_nombre, email: email_programador } = data[0]
    await nodemailer(solicitudCreada(email_cliente, nombre_cliente, id_solicitud))
    setTimeout(() => nodemailer(solicitudProgramador(email_programador, programador_nombre, id_solicitud)), 10000)
    return id_solicitud
}

const confirmarOrden = async id => {
    const valueSolicitud = [id]
    const commandSolicitud = 'SELECT * FROM solicitudes WHERE id = $1;'
    const { rows: result } = await pool.query(commandSolicitud, valueSolicitud)
    const {id: solicitud_id, stack_1, stack_2, stack_3, stack_otros, programador_id, nombre_cliente } = result[0]
    const command = 'SELECT * FROM programadores WHERE id = $1'
    const value = [programador_id]
    const { rows } = await pool.query(command, value)
    const { nombre, apellido, foto_url } = rows[0]
    const res = { nombre, apellido, foto_url, stack_1, stack_2, stack_3, stack_otros, solicitud_id, nombre_cliente}
    return res
}


const login = async (email, password) => { 
    const command = 'SELECT * FROM programadores WHERE email = $1'
    const value = [email]
    const { rowCount, rows: data } = await pool.query(command, value)
    if (!rowCount) throw new Error('No existe este usuario') 
    const { clave: password_encriptada } = data[0]
    const passwordEsCorrecta = bcrypt.compareSync(password, password_encriptada)
    if (!passwordEsCorrecta) throw new Error('Contraseña incorrecta')
}

const getCrearPropuesta = async id => {
    const solicitudesCommand = 'SELECT * FROM solicitudes WHERE id = $1'
    const valueID = [id]
    const { rows: solicitud } = await pool.query(solicitudesCommand, valueID)
    const { id: solicitud_id, titulo_proyecto, descripcion_proyecto, stack_1, stack_2, stack_3, stack_otros, boceto, programador_id, nombre_cliente } = solicitud[0]
    const coderCommand = 'SELECT * FROM programadores WHERE id = $1'
    const programadorID = [programador_id]
    const { rows: data } = await pool.query(coderCommand, programadorID)
    const { nombre, apellido } = data[0]
    const res ={ nombre, apellido, nombre_cliente, titulo_proyecto, descripcion_proyecto, stack_1, stack_2, stack_3, stack_otros, boceto, solicitud_id }
    return res
}

const postCrearPropuesta = async (id, obj) => {
    const values = Object.values(obj[0])
    values.unshift(id)
    const command =
    'INSERT INTO propuesta_coder VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'
    const {rows: result} = await pool.query(command, values)
    const { solicitud_id, id: propuesta_coderID } = result[0]
    const solicitudCommand = 'SELECT * FROM solicitudes WHERE id = $1'
    const valueSolicitud = [solicitud_id]
    const { rows: data } = await pool.query(solicitudCommand, valueSolicitud)
    const { email: email_cliente, nombre: nombre_cliente, programador_id } = data[0]
    const programador_command = 'SELECT * FROM programadores WHERE id = $1'
    const programador_value = [programador_id]
    const { rows: programador_data } = await pool.query(programador_command, programador_value)
    const { nombre: programador_nombre, email: programador_email } = programador_data[0]
    await (nodemailer(propuestaCliente(email_cliente, nombre_cliente, propuesta_coderID)))
    setTimeout(() => nodemailer(propuestaCoder(programador_email, programador_nombre, propuesta_coderID)), 10000) 
}

const seguimiento = async id => { 
    const command = 'SELECT * FROM solicitudes WHERE id = $1'
    const value = [id]
    const { rows } = await pool.query(command, value)
    if (rows.length === 0) throw ({ code: 404, message: 'No existe esta solicitud' })
}

const misSolicitudes = async mail => {
    const command = `SELECT * FROM programadores WHERE email = $1`
    const value = [mail]
    const { rows: data } = await pool.query(command, value)
    const { id, nombre, apellido } = data[0]
    const valueID = [id]
    const commandSolicitudes = 'SELECT * FROM solicitudes WHERE programador_id = $1 ORDER BY fecha_solicitud DESC'
    const { rows: solicitudes } = await pool.query(commandSolicitudes, valueID)
    return { nombre, apellido, solicitudes } 
}


const envioPropuesta = async id => {
    const commandPropuesta = 'SELECT * FROM propuesta_coder WHERE id = $1'
    const valuePropuesta = [id]
    const {rows: data_propuesta} = await pool.query(commandPropuesta, valuePropuesta)
    const {solicitud_id} = data_propuesta[0]
    const commandSolicitud = 'SELECT * FROM solicitudes WHERE id = $1'
    const valueSolicitud = [solicitud_id]
    const {rows: data_solicitud} = await pool.query(commandSolicitud, valueSolicitud)
    const {nombre_cliente, apellido_cliente, programador_id} = data_solicitud[0]
    const commandProgramador = 'SELECT * FROM programadores WHERE id = $1'
    const valueProgramador = [programador_id]
    const { rows: programador } = await pool.query(commandProgramador, valueProgramador)
    const { nombre: nombre_coder, apellido: apellido_coder, foto_url} = programador[0]
    const result = [{cliente: [nombre_cliente, apellido_cliente]}, 
            {programador: [nombre_coder, apellido_coder, foto_url]}, data_propuesta] 
    return result
}

module.exports = {
    consultar, crearPerfil, perfilFreeCoder,
    contactarCoder, confirmarOrden, login, getCrearPropuesta, postCrearPropuesta, seguimiento, misSolicitudes,
    envioPropuesta
}