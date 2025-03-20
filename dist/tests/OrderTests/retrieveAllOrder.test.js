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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../../index");
const testHelper_1 = require("../testHelper");
const PersonRepository_1 = require("../../repository/PersonRepository");
const SERVER_URL = `http://localhost:${index_1.PORT}`;
describe('retrieveAllOrders', () => {
    let token;
    let personUid;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // clear
        yield axios_1.default.delete(`${SERVER_URL}/api/order/v1/clear`);
        const register = yield (0, testHelper_1.registerUserRequest)('user', 'password', 'email');
        token = register.data;
        const sessionRepo = new PersonRepository_1.SessionRepository();
        const uid = yield sessionRepo.findPersonUidFromToken(token);
        if (uid === null) {
            throw new Error('Person UID not found');
        }
        personUid = uid;
        // Create an order to test retrieval
        yield createOrder(token, personUid, [
            { itemId: 'item123', itemQuantity: 2, itemSeller: 'sellerX' }
        ], '{"details": "Valid invoice details"}');
    }));
    console.log('order created');
    test('should retrieve all orders for a valid personUid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid}`, { headers: { token } });
        expect(res.status).toBe(200);
        expect(res.data.orders).toBeInstanceOf(Array);
        res.data.orders.forEach((order) => {
            expect(order).toHaveProperty('orderUid', expect.any(String));
            expect(order).toHaveProperty('personUid', expect.any(String));
            expect(order).toHaveProperty('invoiceDetails', expect.any(Object)); // Adjust fields as per schema
        });
    }));
    test('should return 400 when personUid is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios_1.default.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid}`, { headers: { token } });
        }
        catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toStrictEqual({ error: 'personUid is required' });
        }
    }));
    test('should return 401 when token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield axios_1.default.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${'notaUid'}`, { headers: { token: '' } });
        }
        catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toStrictEqual({ error: 'Unauthorized' });
        }
    }));
    // test('should return 200 with empty array if no orders exist', async () => {
    //   // create user with no orders
    //   const register2 = await registerUserRequest('user2', 'password2', 'email2');
    //   const token2 = register2.data;
    //   const sessionRepo = new SessionRepository();
    //   const uid2 = sessionRepo.findPersonUidFromToken(token2);
    //   if (uid2 === null) {
    //     throw new Error('Person UID not found');
    //   }
    //   const personUid2 = uid2;
    //   const res = await axios.get(
    //     await axios.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid2}`,
    //       { headers: { token } })
    //   );
    //   expect(res.status).toBe(200);
    //   expect(res.data).toStrictEqual([]); // Expect empty array if no orders exist
    // });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server); // Ensure the server is closed after tests
    }));
});
// Helper function to create an order
function createOrder(token, personUid, itemList, invoiceDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield axios_1.default.post(`${SERVER_URL}/api/order/v1/order/create`, { personUid, itemList, invoiceDetails }, { headers: { token } });
        }
        catch (error) {
            throw error;
        }
    });
}
