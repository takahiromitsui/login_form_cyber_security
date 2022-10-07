"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../src/controllers/auth");
describe('put signup', () => {
    const mockReq = {
        body: {
            id: '1',
            email: 'test@test.com',
            password: 'password',
        },
    };
    const mockRes = {
        json: send
    };
    const mockEncryptFunc = (password, saltRounds) => __awaiter(void 0, void 0, void 0, function* () {
        return 'hashedPassword';
    });
    it('', () => {
        const database = [
            {
                id: '1',
                email: 'test@test.com',
                hashedPassword: 'password',
            },
        ];
        const res = (0, auth_1.putSignup)({
            database: database,
            encryptFunc: mockEncryptFunc,
        })(mockReq, mockRes);
    });
});
