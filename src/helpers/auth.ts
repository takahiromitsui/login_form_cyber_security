import bcrypt from 'bcryptjs';

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
