const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controllers/user_controller');
const authMiddleware = require('../middleware/auth_middleware');

router.post('/login', controller.login);
router.post('/register', controller.register);

router.get('/me', authMiddleware, controller.me);
router.get('/users', authMiddleware, controller.listUsers);

router.get('/:id', authMiddleware, controller.getUser);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
