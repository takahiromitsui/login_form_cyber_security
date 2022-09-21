import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import { decryptPassword, encryptPassword } from '../helpers/auth';
import { User } from '../models/user';

const router = Router();

const users: User[] = [];

router.put(
	'/signup',
	putSignup({
		database: users,
		encryptFunc: encryptPassword,
	})
);

router.post(
	'/login',
	postLogin({
		database: users,
		decryptFunc: decryptPassword,
	})
);

export default router;
