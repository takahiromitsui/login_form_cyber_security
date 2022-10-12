import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
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

export interface IsAuthRequest extends Request {
	userId: string;
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = getToken(req);
	const userId = decodeToken('some', token);
	if (!userId) return;
	const userReq = req as IsAuthRequest;
	userReq.userId = userId;
	next();
};
