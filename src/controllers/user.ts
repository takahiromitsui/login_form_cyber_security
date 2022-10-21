import { Request, Response } from 'express';
import { customLogger, WinstonLevel } from '../logger';
import { IsAuthRequest } from '../middleware/isAuth';
import { User } from '../models/user';

export const getUser = (database: User[]) => {
	return async (req: Request, res: Response) => {
		const userReq = req as IsAuthRequest;
		const userId = userReq.userId;
		try {
			const selectedUsers = database.filter(user => {
				return user.id === userId;
			});
			const { id, email } = selectedUsers[0];
			const data = {
				id: id,
				email: email,
			};
			customLogger(WinstonLevel.INFO, 'Get user info');
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
