const express = require('express')
const router = express.Router()
const indexController = require('../controller/indexController')

router.get('/', indexController.show)
router.get('/home', indexController.show)
/* 
router.post('/login', indexController)
router.post('/busqueda', indexController')
router.get('/perfilfreecoder:/id', indexController)
router.post('/crearperfil', indexController)
router.get('/busqueda', indexController)
router.get('/perfilfreecoder/:id', indexController) 
router.post('/crearperfil', indexController)
router.post('/contactarfreecoder', indexController)
router.post('/crearpropuesta', indexController)
router.post('/abonarpropuesta', indexController)
router.post('/confirmarorden', indexController)
router.post('/seguimiento', indexController)
router.post('/enviopropuesta', indexController)
*/

module.exports = router
