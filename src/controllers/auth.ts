import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customLogger, WinstonLevel } from '../logger';
import userModel, { User } from '../models/user';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

interface SignupConfig {
	// database: User[]; // This is a temporal database
	encryptFunc: (password: string, saltRounds: number) => Promise<string>;
}

interface LoginConfig {
	database: User[];
	decryptFunc: (
		password: string,
		hashedPassword: string
	) => Promise<string | boolean>;
	generateToken: (
		payload: string | object | Buffer,
		secretOrPrivateKey: jwt.Secret,
		options?: jwt.SignOptions | undefined
	) => string;
}

export const putSignup = (signupConfig: SignupConfig) => {
	return async (req: Request, res: Response) => {
		const id = new Date().toString();
		const email = req.body.email;
		const password = req.body.password;
		// Later implement email is valid && password is secured enough
		// const users = signupConfig.database?.filter((user: User) => {
		// 	return user.email === email;
		// });
		// const isMatched = users.length !== 0;
		// if (isMatched) {
		// 	customLogger(WinstonLevel.ERROR, 'User already exist');
		// 	return res.status(401).json({
		// 		message: 'invalid input',
		// 	});
		// }
		const hashedPassword = await signupConfig.encryptFunc(password, 10);
		const data: User = {
			id: id,
			email: email,
			hashedPassword: hashedPassword,
		};
		const user = new userModel({
			email: email,
			hashedPassword: hashedPassword,
		});

		user
			.save()
			.then((result: any) => {
				console.log(result);
				return res.status(201).json({
					message: 'successfully signup',
				});
			})
			.catch((e: Error) => {
				customLogger(WinstonLevel.ERROR, e.message);
				return res.status(500).json({
					message: 'Something wrong',
				});
			});

		// customLogger(WinstonLevel.INFO, 'Send sign-up data');
		// signupConfig.database?.push(data);
		// return res.status(201).json({
		// 	message: 'successfully signup',
		// 	data: data,
		// });
	};
};

export const postLogin = (loginConfig: LoginConfig) => {
	return async (req: Request, res: Response) => {
		const email = req.body.email;
		const password = req.body.password;

		const users = loginConfig.database.filter((user: User) => {
			return user.email === email;
		});
		const isValidEmail = users.length !== 0;
		if (!isValidEmail) {
			customLogger(WinstonLevel.ERROR, 'User not found');
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		const hashedPassword = users[0].hashedPassword;
		const isEqual = await loginConfig.decryptFunc(password, hashedPassword);
		if (typeof isEqual === 'string') {
			customLogger(WinstonLevel.ERROR, isEqual);
			return res.status(500).json({ message: isEqual });
		}

		if (!isEqual) {
			customLogger(WinstonLevel.ERROR, 'Wrong Password');
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		const token = loginConfig.generateToken(
			{
				id: users[0].id,
				email: email,
			},
			process.env.JWT_SECRET as string,
			{
				expiresIn: '1h',
			}
		);
		customLogger(WinstonLevel.INFO, 'Successfully Login');
		return res.status(200).json({
			message: 'successfully signup',
			data: {
				token: token,
				userId: users[0].id,
			},
		});
	};
};
