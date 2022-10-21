import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import {
	decryptPassword,
	encryptPassword,
	generateToken,
} from '../helpers/auth';
import { User } from '../models/user';

const router = Router();

export const defaultDatabase: User[] = [];

router.put(
	'/signup',
	putSignup({
		database: defaultDatabase,
		encryptFunc: encryptPassword,
	})
);

router.post(
	'/login',
	postLogin({
		database: defaultDatabase,
		decryptFunc: decryptPassword,
		generateToken: generateToken,
	})
);

export default router;
