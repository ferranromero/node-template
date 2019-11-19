import 'dotenv/config';
import { Router } from 'express';
import checkAuthentication from './middleware';
import { login, register } from '../controllers/AuthenticationController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/privat', checkAuthentication, () => {});

export default router;
