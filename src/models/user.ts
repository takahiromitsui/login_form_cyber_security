import mongoose, { Model } from 'mongoose';

export type User = {
	id: string;
	email: string;
	hashedPassword: string;
};

interface UserInterface {
	email: string;
	hashedPassword: string;
	createdAt: number;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<UserInterface, Model<UserInterface>>(
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
