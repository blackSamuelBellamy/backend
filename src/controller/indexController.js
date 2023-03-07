const consultar = require('../services/indexServices')


const indexController = {
  show: async (req, res) => {
    try {
      const resultado = await consultar()
      res.status(200).json(resultado)

    }
    catch (e) {
      console.log(e.message)
    }
  }
}

module.exports = indexController