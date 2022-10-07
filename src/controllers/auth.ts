import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomResponseType, ExpressRouteFunc } from '.';
import { customLogger, WinstonLevel } from '../logger';
import { User } from '../models/user';

interface SignupConfig {
	database: User[]; // This is a temporal database
	encryptFunc: (password: string, saltRounds: number) => Promise<string>;
}

interface LoginConfig {
	database: User[];
	decryptFunc: (
		password: string,
		hashedPassword: string
	) => Promise<string | boolean>;
}

export const putSignup = (signupConfig: SignupConfig)=> {
	return async (req: Request, res: Response) => {
		const id = req.body.id;
		const email = req.body.email;
		const password = req.body.password;
		// Later implement email is valid && password is secured enough
		const users = signupConfig.database?.filter((user: User) => {
			return user.email === email;
		});
		const isMatched = users.length !== 0;
		if (isMatched) {
			customLogger(WinstonLevel.ERROR, 'User already exist');
			return res.status(401).json({
				message: 'invalid input',
			});
		}
		const hashedPassword = await signupConfig.encryptFunc(password, 10);
		const data: User = {
			id: id,
			email: email,
			hashedPassword: hashedPassword,
		};
		customLogger(WinstonLevel.INFO, 'Send sign-up data');
		signupConfig.database?.push(data);
		return res.status(201).json({
			message: 'successfully signup',
			data: data,
		});
	};
};

export const postLogin = (loginConfig: LoginConfig): ExpressRouteFunc => {
	return async (req: Request, res: CustomResponseType) => {
		const email = req.body.email;
		const password = req.body.password;
		const users = loginConfig.database.filter((user: User) => {
			return user.email === email;
		});
		const isValidEmail = users.length !== 0;
		if (!isValidEmail) {
			customLogger(WinstonLevel.ERROR, 'User not found');
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}
		const hashedPassword = users[0].hashedPassword;
		const isEqual = await loginConfig.decryptFunc(password, hashedPassword);
		if (typeof isEqual === 'string') {
			customLogger(WinstonLevel.ERROR, isEqual);
			res.status(500).json({ message: isEqual });
			return;
		}
		if (!isEqual) {
			customLogger(WinstonLevel.ERROR, 'Wrong Password');
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}
		const token = jwt.sign(
			{
				id: users[0].id,
				email: email,
			},
			'somelongsecret',
			{
				expiresIn: '1h',
			}
		);
		customLogger(WinstonLevel.INFO, 'Successfully Login');
		res.status(200).json({
			message: 'successfully signup',
			data: {
				token: token,
				userId: users[0].id,
			},
		});
	};
};
