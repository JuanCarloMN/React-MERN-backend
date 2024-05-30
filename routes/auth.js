/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post( 
    '/new', 
    [// Middlewares
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'password', 'El password debe de ser al menos de 6 caracteres' ).isLength({ min: 6 }),
        fieldsValidator
    ],
    createUser 
);


router.post(
    '/', 
    [// Middlewares
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'password', 'El password es obligatorio' ).not().isEmpty(),
        fieldsValidator
    ],
    loginUser
);

router.get(
    '/renew',
    validateJWT,
    renewToken 
);

module.exports = router;