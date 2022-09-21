import { Router } from 'express';
import { putSignup } from '../controllers/auth';
import { encryptPassword } from '../helpers/auth';

const router = Router();

router.put(
	'/signup',
	putSignup({
		encryptFunc: encryptPassword,
	})
);

export default router;
