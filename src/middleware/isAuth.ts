import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { customLogger, WinstonLevel } from '../logger';

export interface JwtToken {
	userId?: string;
}

export const getToken = (req: Request): string | undefined => {
	const token = req.get('Authorization')?.split(' ')[1];
	return token;
};

export const decodeToken = (secret: string, token?: string) => {
	if (!token) {
		customLogger(WinstonLevel.ERROR, 'token is undefined');
		return;
	}
	const { userId } = jwt.verify(token, secret) as JwtToken;
	if (!userId) {
		customLogger(WinstonLevel.ERROR, 'cannot find userId');
		return;
	}
	customLogger(WinstonLevel.INFO, 'can extract userId');
	return userId;
};

