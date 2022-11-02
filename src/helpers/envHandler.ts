import * as dotenv from 'dotenv';
dotenv.config();

export const handleWhitelist = () => {
  const env = process.env.NODE_ENV || 'development';
	if (env === 'development') {
		return process.env.POSSIBLE_LOCAL_URL
			? [process.env.POSSIBLE_LOCAL_URL]
			: ['http://localhost:3000'];
	}
	if (!process.env.POSSIBLE_ORIGIN_URL1) {
		return ['http://localhost:3000'];
	}
	return [
		process.env.POSSIBLE_ORIGIN_URL1,
		process.env.POSSIBLE_ORIGIN_URL2,
		process.env.POSSIBLE_ORIGIN_URL3,
	];
};
