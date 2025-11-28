// routes/auth.routes.js
import express from 'express';
import authController from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/ping', (req, res) => res.json({ ok: true, route: 'auth' }));

export default router;
