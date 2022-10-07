import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const encryptPassword = async (
	password: string,
	saltRounds: number
): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};

export const decryptPassword = async (
	password: string,
	hashedPassword: string
): Promise<string | boolean> => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (e) {
		return (e as Error).message;
	}
};

export const generateToken = (
	payload: string | object | Buffer,
	secretOrPrivateKey: jwt.Secret,
	options?: jwt.SignOptions | undefined
): string => {
	return jwt.sign(payload, secretOrPrivateKey, options);
};
