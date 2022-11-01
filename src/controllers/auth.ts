import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customLogger, WinstonLevel } from '../logger';
import userModel, { User } from '../models/user';
import * as dotenv from 'dotenv';
dotenv.config();

interface SignupConfig {
	encryptFunc: (password: string, saltRounds: number) => Promise<string>;
}

interface LoginConfig {
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
		const email = req.body.email;
		const password = req.body.password;
		const hashedPassword = await signupConfig.encryptFunc(password, 10);
		const user = new userModel({
			email: email,
			hashedPassword: hashedPassword,
		});
		try {
			const existed = await userModel.findOne({
				email: email,
			});
			if (existed) {
				customLogger(WinstonLevel.ERROR, 'user already existed');
				return res.status(401).json({
					message: 'Invalid input',
				});
			}
			await user.save();
			customLogger(WinstonLevel.HTTP, 'successfully signup');
			return res.status(201).json({
				message: 'successfully signup',
			});
		} catch (e) {
			const error = e as Error;
			customLogger(WinstonLevel.ERROR, error.message);
			return res.status(500).json({
				message: 'something wrong with database',
			});
		}
	};
};

export const postLogin = (loginConfig: LoginConfig) => {
	return async (req: Request, res: Response) => {
		const email = req.body.email;
		const password = req.body.password;
		try {
			const user = await userModel.findOne({
				email: email,
			});
			if (!user) {
				customLogger(WinstonLevel.ERROR, 'user not found');
				return res.status(401).json({ message: 'invalid email or password' });
			}
			const { id, hashedPassword } = user;
			const isEqual = await loginConfig.decryptFunc(password, hashedPassword);
			if (typeof isEqual === 'string') {
				customLogger(WinstonLevel.ERROR, isEqual);
				return res.status(500).json({ message: isEqual });
			}
			if (!isEqual) {
				customLogger(WinstonLevel.ERROR, 'wrong Password');
				return res.status(401).json({ message: 'invalid email or password' });
			}
			const token = loginConfig.generateToken(
				{
					id: id,
				},
				process.env.JWT_SECRET as string,
				{
					expiresIn: '1h',
				}
			);
			customLogger(WinstonLevel.HTTP, 'successfully login');
			return res.status(200).json({
				message: 'successfully signup',
				data: {
					token: token,
				},
			});
		} catch (e) {
			const error = e as Error;
			return res.status(401).json({ message: error.message });
		}
	};
};
