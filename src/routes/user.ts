import { request, Router } from 'express';
import { getUser } from '../controllers/user';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.get('/info', isAuth, getUser());

export default router;
