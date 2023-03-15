const jwt = require('jsonwebtoken')
const { consultar, crearPerfil, perfilFreeCoder, contactarCoder, confirmarOrden,
getCrearPropuesta, postCrearPropuesta, seguimiento, misSolicitudes, envioPropuesta, login } = require('../services/indexServices')



const indexController = {
  show: async (_, res) => {
    try {
      const resultado = await consultar()
      res.status(200).json(resultado)

    }
    catch (err) {
      res.send(err.message)
    }
  },

  crearPerfil: async (req, res) => {
    try {
      const { nombre } = req.body.personalInformation
      await crearPerfil(req.body) 
      res.status(200).send(`Perfil ${nombre} creado ✌️`)

    } catch (err) {
      res.send(err.message)
    }
  },

  perfil: async (req, res) => {
    try {
      const { id } = req.params
      const data = await perfilFreeCoder(id)
      res.status(200).json(data)
    } catch (err) {
      res.send(err.message)
    }
  },

  solicitud: async (req, res) => {
    try {
      const data = req.body
      const id = await contactarCoder(data)
      const tokencliente = jwt.sign({id}, process.env.TOKEN1, {expiresIn: '1h'}) 
      res.status(200).send(tokencliente)
    } catch (err) {
      res.send(err.message)
    }
  },

  confirmar: async(req, res ) => {
    try {
      const Authorization = req.header('Authorization')
      const token = Authorization.split('Bearer ')[1]
      jwt.verify(token, process.env.TOKEN1)
      const id = jwt.decode(token).id
      const data = await confirmarOrden(id)
      res.status(200).json(data)
    } catch(err) {
      res.send(err.message)
    }
  },
  logear: async(req, res) => {
    try {
      const { email, password } = req.body
      const tokenCoder = jwt.sign({ email }, process.env.TOKEN2, {expiresIn: '1h'}) 
      await login(email, password)
      res.status(200).send(tokenCoder)
    } catch(err) {
      res.status(404).send(err.message)
    }
  },
  getCrear: async(req, res) => {
    try {
      const { id } = req.params
      const Authorization = req.header('Authorization')
      const token = Authorization.split('Bearer ')[1]
      jwt.verify(token, process.env.TOKEN2)
      const result = await getCrearPropuesta(id)
      res.status(200).json(result)
    } catch(err) {
      res.status(500).send(err.message)
    }
  },
  postCrear: async(req, res) => {
    try {
      const Authorization = req.header('Authorization')
      const token = Authorization.split('Bearer ')[1]
      const {id } = req.params
      jwt.verify(token, process.env.TOKEN2)
      await postCrearPropuesta(id, req.body)
      res.status(200).send('oferta enviada')
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  seguir: async(req, res) => {
    try {
      const { id }= req.body[0]
      console.log(id)
      await seguimiento(id)
      res.status(200).send('existe solicitud')
    } catch (err) {
      res.status(404).send(err.message)
    }
  },
  solicitudes: async(req, res) => {
    try {
      const Authorization = req.header('Authorization')
      const token = Authorization.split('Bearer ')[1]
      jwt.verify(token, process.env.TOKEN2)
      const {email} = jwt.decode(token)
      const result = await misSolicitudes(email)
      res.status(200).json(result)
    } catch(err) {
      res.status(404).send(err.message)
    }
  },
  envioDePropuesta: async(req, res) => {
    try {
      const {id} = req.params
      const result = await envioPropuesta(id)
      res.status(200).json(result)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

}

module.exports = indexController