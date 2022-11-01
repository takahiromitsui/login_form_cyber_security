import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { customLogger, WinstonLevel } from '../logger';

export const checkEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	await body('email')
		.isEmail()
		.withMessage('this email address is invalid')
		.run(req);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const { msg } = errors.array()[0];
		customLogger(WinstonLevel.ERROR, msg);
		return res.status(400).json({
			message: msg,
		});
	}
	next();
};
