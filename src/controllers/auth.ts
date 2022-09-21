import { Request, Response } from 'express';
import { ExpressRouteFunc } from '.';
import { customLogger, WinstonLevel } from '../logger';
import { User } from '../models/user';

interface SignupConfig {
	database?: User[]; // This is a temporal database
	encryptFunc: (
		password: string,
		saltRounds: number
	) => Promise<{
		salt: string;
		hashedPassword: string;
	}>;
}

export const putSignup = (signupConfig: SignupConfig): ExpressRouteFunc => {
	return async (req: Request, res: Response) => {
		const id = req.body.id;
		const email = req.body.email;
		const password = req.body.password;
		const { salt, hashedPassword } = await signupConfig.encryptFunc(
			password,
			10
		);
		const data: User = {
			id: id,
			email: email,
			salt: salt,
			hashedPassword: hashedPassword,
		};
		customLogger(WinstonLevel.INFO, 'Send sign-up data');
		signupConfig.database?.push(data);
		res.status(200).json(data);
	};
};

// export const postLogin = (): ExpressRouteFunc => {
// 	return (req: Request, res: Response) => {};
// };
