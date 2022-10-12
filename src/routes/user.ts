import { request, Router } from 'express';
import { getUser } from '../controllers/user';
import { isAuth } from '../middleware/isAuth';
import { User } from '../models/user';

const router = Router();
const users: User[] = [];
router.get('/info', getUser(users));


export default router