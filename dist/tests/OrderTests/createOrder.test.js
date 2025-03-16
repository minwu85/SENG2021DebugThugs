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
const OrderRepository_1 = require("../../repository/OrderRepository");
const testHelper_1 = require("../testHelper");
const PersonRepository_1 = require("../../repository/PersonRepository");
const SERVER_URL = `http://localhost:${index_1.PORT}`;
describe('createOrder', () => {
    let token;
    let personUid;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // insert clear function
        const register = yield (0, testHelper_1.registerUserRequest)('user', 'password', 'email');
        token = register.data;
        const sessionRepo = new PersonRepository_1.SessionRepository();
        const uid = sessionRepo.findPersonUidFromToken(token);
        if (uid === null) {
            throw new Error('Person UID not found');
        }
        personUid = uid;
    }));
    test('successful order creation', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, testHelper_1.createOrder)(token, personUid, [
            {
                itemId: 'itemId',
                itemQuantity: 2,
                itemSeller: 'seller'
            }
        ], 'details');
        expect(res.status).toBe(200);
        expect(res.data.result).toStrictEqual(expect.any(String));
        // check has been added to repo
        const repo = new OrderRepository_1.OrderRepository;
        const find = repo.findByOrderUid(res.data.result);
        expect(find).toBeDefined();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server);
    }));
});
