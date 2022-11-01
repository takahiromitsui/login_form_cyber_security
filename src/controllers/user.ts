import { Request, Response } from 'express';
import { customLogger, WinstonLevel } from '../logger';
import { IsAuthRequest } from '../middleware/isAuth';
import userModel from '../models/user';

export const getUser = () => {
	return async (req: Request, res: Response) => {
		const userReq = req as IsAuthRequest;
		const userId = userReq.userId;
		try {
			const selected = await userModel.findById(userId);
			if (!selected) {
				customLogger(WinstonLevel.ERROR, 'cannot fetch user info');
				return res.status(401).send({
					message: 'something went wrong',
				});
			}
			const { email, createdAt } = selected;
			const data = {
				email: email,
				createdAt: createdAt,
			};
			customLogger(WinstonLevel.INFO, 'got user info');
			return res.status(200).json({
				data: data,
			});
		} catch (e) {
			const error = e as Error;
			customLogger(WinstonLevel.WARN, error.message);
			return res.status(401).send({
				message: error.message,
			});
		}
	};
};
