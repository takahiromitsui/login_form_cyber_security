import { request, Router } from 'express';
import { getUser } from '../controllers/user';
import { isAuth } from '../middleware/isAuth';
import { User } from '../models/user';
import { defaultDatabase } from './auth';

const router = Router();

router.get('/info', isAuth, getUser(defaultDatabase));


export default router