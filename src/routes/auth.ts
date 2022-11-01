import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import {
	decryptPassword,
	encryptPassword,
	generateToken,
} from '../helpers/auth';
import { checkEmail, checkPassword } from '../middleware/validation';
import { User } from '../models/user';
const router = Router();

export const defaultDatabase: User[] = [];


router.put(
	'/signup',
	checkEmail,
	checkPassword,
	putSignup({
		encryptFunc: encryptPassword,
	})
);

router.post(
	'/login',
	checkEmail,
	checkPassword,
	postLogin({
		decryptFunc: decryptPassword,
		generateToken: generateToken,
	})
);

export default router;
