import express from 'express';
import { loginUser, registerUser, registerSuperAdmin } from '../Controllers/auth.js';
import { protect, superadmin } from '../Middleware/auth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, superadmin, registerUser);
router.post('/register-superadmin' , registerSuperAdmin) ;

export default router;