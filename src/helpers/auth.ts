import bcrypt from 'bcryptjs';

export const encryptPassword = async (
	password: string,
	saltRounds: number
): Promise<string> => {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};
