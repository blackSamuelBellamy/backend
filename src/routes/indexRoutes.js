const express = require('express')
const router = express.Router()
const indexController = require('../controller/indexController')

router.get('/', indexController.show)
router.get('/home', indexController.show)
router.get('/perfil/:id', indexController.perfil)
router.post('/crearperfil', indexController.crearPerfil)
router.post('/contactarfreecoder/:id', indexController.solicitud)
router.get('/confirmarorden', indexController.confirmar) 
router.post('/login', indexController.logear)
router.get('/crearpropuesta/:id', indexController.getCrear)
router.post('/crearpropuesta/:id', indexController.postCrear)
router.post('/seguimiento', indexController.seguir)
router.get('/missolicitudes', indexController.solicitudes) 
router.get('/enviopropuesta/:id', indexController.envioDePropuesta)


module.exports = router
