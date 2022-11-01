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
// password has at least one lowercase letter (?=.*[a-z])
// password has at least one uppercase letter (?=.*[A-Z])
// password has at least one digit (?=.*[0-9])
// password has at least one special character ([^A-Za-z0-9])
// password is at least 12 characters long (?=.{12,})
const strongPasswordRegex =
	'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{12,})';

export const checkPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	await body('password')
		.matches(strongPasswordRegex)
		.withMessage(
			'password should include at least one lowercase letter, uppercase letter, digit, and special character. And it should at least 12 letters long'
		)
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
