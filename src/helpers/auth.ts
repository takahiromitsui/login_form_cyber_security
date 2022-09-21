import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string, saltRounds: number) => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return {
		salt: salt,
		hashedPassword: hashedPassword,
	};
};
