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
const testHelper_1 = require("../testHelper");
const PersonRepository_1 = require("../../repository/PersonRepository");
const OrderRepository_1 = require("../../repository/OrderRepository");
const SERVER_URL = `http://localhost:${index_1.PORT}`;
describe('fetchXml', () => {
    let token;
    let personUid;
    let orderUid;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // insert clear function
        // register user
        const register = yield (0, testHelper_1.registerUserRequest)('user', 'password', 'email');
        token = register.data;
        const sessionRepo = new PersonRepository_1.SessionRepository();
        const uid = sessionRepo.findPersonUidFromToken(token);
        if (uid === null) {
            throw new Error('Person UID not found');
        }
        personUid = uid;
        // create order
        const order = yield (0, testHelper_1.createOrder)(token, personUid, [
            {
                itemId: 'itemId',
                itemQuantity: 2,
                itemSeller: 'seller'
            }
        ], 'details');
        orderUid = order.data.result;
    }));
    test('successful xml return', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, testHelper_1.fetchXmlRequest)(orderUid);
        expect(res.status).toBe(200);
        expect(res.data).toStrictEqual(expect.any(String));
        // check xml was added to order object in repo
        const orderRepo = new OrderRepository_1.OrderRepository();
        const findOrder = orderRepo.findByOrderUid(orderUid);
        const xmlOrder = findOrder === null || findOrder === void 0 ? void 0 : findOrder.xml;
        expect(xmlOrder).toStrictEqual(expect.any(String));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server);
    }));
    test('order does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, testHelper_1.fetchXmlRequest)('wrongorderuid');
            fail('Did not throw expected error');
        }
        catch (error) {
            if (error instanceof Error) {
                const axiosError = error;
                expect(axiosError.response.status).toBe(500);
                expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
            }
            else {
                throw error;
            }
        }
    }));
});
