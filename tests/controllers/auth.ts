import { expect } from 'chai';
import { Request, Response } from 'express';
import { postLogin, putSignup } from '../../src/controllers/auth';
import { User } from '../../src/models/user';

const mockRes = {
	send: function () {},
	json: function (res: Object) {
		return res;
	},
	status: function (responseStatus: number) {
		return this;
	},
};

describe('putSignup', () => {
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

describe('postLogin', () => {
	const mockDatabase: User[] = [
		{
			id: '0',
			email: 'test@test.com',
			hashedPassword: 'password',
		},
	];

	const mockDecryptFunc = async (
		password: string,
		hashedPassword: string
	): Promise<boolean> => {
		return true;
	};

	it('should return error message by wrong email', async () => {
		const mockReq = {
			body: {
				email: 'wrong@test.com',
				password: 'password',
			},
		} as Request;
		const result = await postLogin({
			database: mockDatabase,
			decryptFunc: mockDecryptFunc,
		})(mockReq, mockRes as Response);
		expect(result).to.eql({ message: 'Invalid email or password' });
	});

	it('should return error message by decrypt func error', async () => {
		const mockReq = {
			body: {
				email: 'test@test.com',
				password: 'password',
			},
		} as Request;
		const mockErrorDecryptFunc = async (
			password: string,
			hashedPassword: string
		): Promise<string> => {
			return 'Something wrong with decrypt func';
		};
		const result = await postLogin({
			database: mockDatabase,
			decryptFunc: mockErrorDecryptFunc,
		})(mockReq, mockRes as Response);
		expect(result).to.eql({ message: 'Something wrong with decrypt func' });
	});

	it('should return error message by wrong password', async () => {
		const mockReq = {
			body: {
				email: 'test@test.com',
				password: 'wrongPassword',
			},
		} as Request;
		const mockErrorDecryptFunc = async (
			password: string,
			hashedPassword: string
		): Promise<boolean> => {
			return false;
		};

		const result = await postLogin({
			database: mockDatabase,
			decryptFunc: mockErrorDecryptFunc,
		})(mockReq, mockRes as Response);
		expect(result).to.eql({ message: 'Invalid email or password' });
	});
	
});
