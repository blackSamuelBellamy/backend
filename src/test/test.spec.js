require('dotenv').config()
const request = require('supertest')
const pool = require('../dataBase/conexion')
const app = require('../../app')

describe('Database connection', () =>{
    
    test('can connect to the database', async() => {
        const result = await pool.query('SELECT NOW()');
        expect(result.rows).toHaveLength(1);
    })

    test('select all from programadores returns at least 3 rows', async() => {
        const result = await pool.query('SELECT * FROM programadores');
        expect(result.rows).toHaveLength(3);
    })

    test('select from programadores where nombre is Gustavo, Sergio, Andrea', async() => {
        const result = await pool.query("SELECT * FROM programadores WHERE nombre IN ('Gustavo', 'Sergio', 'Andrea')");
        expect(result.rows).toHaveLength(3)
    })  

    test('can connect to endpoint /home', async() => {
        const result = await request(process.env.API).get('/home')
        expect(result.status).toBe(200)
    })

    test('can connect to the endpoint /perfil/2', async() => {
        const result = await request(process.env.API).get('/perfil/1')
        expect(result.status).toBe(200)
        
    })

    test('can connect to the endpoint /perfil/2', async() => {
        const result = await request(process.env.API).get('/perfil/2')
        expect(result.status).toBe(200)
        
    })

    test('can connect to the endpoint /perfil/2', async() => {
        const result = await request(process.env.API).get('/perfil/3')
        expect(result.status).toBe(200)
        
    })
    
})