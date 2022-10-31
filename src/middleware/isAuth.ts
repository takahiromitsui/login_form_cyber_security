import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { customLogger, WinstonLevel } from '../logger';
import * as dotenv from 'dotenv';
dotenv.config();

export interface JwtToken {
	id?: string;
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
	try {
		const { id } = jwt.verify(token, secret) as JwtToken;
		return id;
	} catch (e) {
		const error = e as Error;
		customLogger(WinstonLevel.ERROR, error.message);
		return;
	}
};

export interface IsAuthRequest extends Request {
	userId: string;
}

export const isAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = getToken(req);
	const userId = decodeToken(process.env.JWT_SECRET as string, token);
	if (!userId) return;
	const userReq = req as IsAuthRequest;
	userReq.userId = userId;
	next();
};
