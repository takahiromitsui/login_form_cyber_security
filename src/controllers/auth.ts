import { Request, Response } from 'express';
import { ExpressRouteFunc } from '.';

interface SignupConfig {
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
		res.status(200).send({
			id: id,
			email: email,
			salt: salt,
			hashedPassword: hashedPassword,
		});
	};
};
