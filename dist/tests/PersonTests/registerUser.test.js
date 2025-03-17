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
describe('registerUser', () => {
    beforeEach(() => {
        // insert clear function
    });
    test('successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, testHelper_2.registerUserRequest)('test', 'test', 'test');
        expect(res.status).toBe(200);
        expect(res.data).toStrictEqual(expect.any(String));
        // check that person was pushed into person repo and token into session
        const repoP = new PersonRepository_1.PersonRepository;
        const findPerson = repoP.findByUsername('test');
        expect(findPerson).not.toBeNull();
        expect(findPerson).toBeDefined();
        const repoS = new PersonRepository_1.SessionRepository;
        const findSession = repoS.findPersonUidFromToken(res.data);
        expect(findSession).toStrictEqual(expect.any(String));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server);
    }));
});
