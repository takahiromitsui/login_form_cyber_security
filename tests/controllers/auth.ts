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
	const mockReq = {
		body: {
			id: '1',
			email: 'test@test.com',
			password: 'password',
		},
	} as Request;

	const mockRes = {
		send: function () {},
		json: function (res: Object) {
			return res;
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
		})(mockReq, mockRes as Response);
		expect(result).to.eql({ message: 'invalid input' });
	});

	it('should return success message', async () => {
		const database: User[] = [
			{
				id: '0',
				email: 'test2@test.com',
				hashedPassword: 'password',
			},
		];
		const result = await putSignup({
			database: database,
			encryptFunc: mockEncryptFunc,
		})(mockReq, mockRes as Response);
		
		expect(result).not.to.eql({ message: 'invalid input' });
		expect(result).to.eql({
			message: 'successfully signup',
			data: {
				id: '1',
				email: 'test@test.com',
				hashedPassword: 'hashedPassword',
			},
		});
	});
});
