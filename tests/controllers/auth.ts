import { expect } from 'chai';
import { Request, Response } from 'express';
import { putSignup } from '../../src/controllers/auth';
import { User } from '../../src/models/user';

describe('put signup', () => {
	const mockEncryptFunc = async (
		password: string,
		saltRounds: number
	): Promise<string> => {
		return 'hashedPassword';
	};
	const req = {
		body: {
			id: '1',
			email: 'test@test.com',
			password: 'password',
		},
	} as Request;

	const res = {
		send: function () {},
		json: function (message: Object) {
			return message;
		},
		status: function (responseStatus: number) {
			return this;
		},
	};

	it('should return error message', async () => {
		const database: User[] = [
			{
				id: '1',
				email: 'test@test.com',
				hashedPassword: 'password',
			},
		];

		const result = await putSignup({
			database: database,
			encryptFunc: mockEncryptFunc,
		})(req, res as Response);
		expect(result).to.eql({ message: 'invalid input' });
	});
});
