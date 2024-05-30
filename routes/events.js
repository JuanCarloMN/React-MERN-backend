/*
    Rutas de Eventos 
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// Todas deben de pasar por la validación del JWT
router.use( validateJWT );

// Obtener eventos
router.get('/', getEvents);

// Crear eventos
router.post(
    '/new', 
    [// Middlewares
        check( 'title', 'El tútulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'La fecha inicio es obligatorio' ).custom( isDate ),
        check( 'end', 'La fecha fin es obligatorio' ).custom( isDate ),
        fieldsValidator,
    ],
    createEvent
);

// Actualizar eventos
router.put(
    '/:id', 
    [// Middlewares
        check( 'id', 'El id es obligatorio' ).not().isEmpty(),
        fieldsValidator,
    ],
    updateEvent
);

// Eliminar eventos
router.delete(
    '/:id', 
    [// Middlewares
        check( 'id', 'El id es obligatorio' ).not().isEmpty(),
        fieldsValidator,
    ],
    deleteEvent
);

module.exports = router;