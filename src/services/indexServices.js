const pool = require('../dataBase/conexion')

const consultar = async () => {
    const command = 'SELECT * FROM programadores'
    const { rows: resultado } = await pool.query(command)
    if(!resultado) throw {code: 500, message: 'ocurrió un error al conectar con la base de datos'}
    return resultado
}

const crearPerfil = async obj => { // obj es el archivo write que se colocará en el controller
    const personalInfo = Object.values(obj.personalInformation) // creamos un array de la información personal
    const parameters = personalInfo.map((x, index) => `$${index + 1}`).join(', ') // creamos los $1 ...$ 5 de forma dinámica
    const programmersCommand = `INSERT INTO programadores VALUES(DEFAULT, ${parameters}) RETURNING id;` // creamos el comando y además retornamos el id
    const programmersValues = personalInfo.map(element => element) // iteramos toda la información personal para hacerlo dinamico
    const { rows: result } = await pool.query(programmersCommand, programmersValues) // insertamos la informacion en la tabla
    const id = result[0].id // rescatamos el id del programador para incluirlo en las otras tablas

    const skills = async(main_table, create_table, id) => { // para base de datos, framework y lenguajes ocupamos esta funcion
        const { rows: result } = await pool.query(`SELECT * FROM ${main_table}`) // obtenemos la tabla que deseamos
        const skill = result.filter(sk => obj[main_table].includes(sk.nombre)) // cruzamos la informacion con las skills del coder
        const skillCommand = `INSERT INTO ${create_table} VALUES (DEFAULT, $1, $2)` // creamos el comando para insertar datos
        for (const index in skill) { // si tiene más de un lenguaje ,database, o frame se colocaran todos de forma dinamica
            const value = [id, skill[index].id] 
            await pool.query(skillCommand, value)
        }      
    }
    await skills('lenguajes', 'programador_lenguaje', id) // llamamos la función para cada tabla con el id del coder
    await skills('frameworks', 'framework_lenguaje', id)
    await skills('basedatos', 'programador_basedatos', id)
}


module.exports = {consultar, crearPerfil}