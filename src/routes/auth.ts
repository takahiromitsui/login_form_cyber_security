import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import {
	decryptPassword,
	encryptPassword,
	generateToken,
} from '../helpers/auth';
import { checkEmail, checkPassword } from '../middleware/validation';
const router = Router();

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
