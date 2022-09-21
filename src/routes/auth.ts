import { Router } from 'express';
import { putSignup } from '../controllers/auth';
import { encryptPassword } from '../helpers/auth';
import { User } from '../models/user';

const router = Router();

const users: User[] = [];

router.put(
	'/signup',
	putSignup({
		encryptFunc: encryptPassword,
		database: users,
	})
);

export default router;
