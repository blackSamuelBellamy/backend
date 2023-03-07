const pool = require('../dataBase/conexion')

const consultar = async () => {
    const command = 'SELECT * FROM programadores'
    const { rows: resultado } = await pool.query(command)
    if(!resultado) throw {code: 500, message: 'ocurrió un error al conectar con la base de datos'}
    return resultado
}


module.exports = consultar