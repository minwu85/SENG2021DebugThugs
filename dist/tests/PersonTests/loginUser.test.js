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
const index_1 = require("../../index");
const PersonRepository_1 = require("../../repository/PersonRepository");
const testHelper_1 = require("../testHelper");
const testHelper_2 = require("../testHelper");
describe('loginUser', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // insert clear function
        yield (0, testHelper_2.registerUserRequest)('user', 'password', 'email');
    }));
    test('successful login', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, testHelper_2.loginUserRequest)('email', 'password');
        expect(res.status).toBe(200);
        expect(res.data).toStrictEqual(expect.any(String));
        // check session was pushed
        const repo = new PersonRepository_1.SessionRepository();
        const findSession = repo.findPersonUidFromToken(res.data);
        expect(findSession).toBeDefined();
    }));
    test('wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, testHelper_2.loginUserRequest)('email', 'wrongpassword');
            fail('Did not throw expected error');
        }
        catch (error) {
            if (error instanceof Error) {
                const axiosError = error;
                expect(axiosError.response.status).toBe(401);
                expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
            }
            else {
                throw error;
            }
        }
    }));
    test('wrong userInput', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, testHelper_2.loginUserRequest)('wrongemail', 'password');
            fail('Did not throw expected error');
        }
        catch (error) {
            if (error instanceof Error) {
                const axiosError = error;
                expect(axiosError.response.status).toBe(401);
                expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
            }
            else {
                throw error;
            }
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server);
    }));
});
