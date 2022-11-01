import mongoose from 'mongoose';

export type User = {
	id: string;
	email: string;
	hashedPassword: string;
};

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
