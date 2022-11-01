import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import {
	decryptPassword,
	encryptPassword,
	generateToken,
} from '../helpers/auth';
import { checkEmail } from '../middleware/validation';
import userModel, { User } from '../models/user';

const router = Router();

export const defaultDatabase: User[] = [];

router.put(
	'/signup',
	checkEmail,
	putSignup({
		// database: userModel,
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
