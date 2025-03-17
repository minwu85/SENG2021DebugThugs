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
const OrderRepository_1 = require("../../repository/OrderRepository");
const testHelper_1 = require("../testHelper");
const SERVER_URL = `http://localhost:${index_1.PORT}`;
describe('cancelOrder', () => {
    let orderId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create an order to test
        const createRes = yield createOrder('testToken', 'testPersonUid', [{ itemId: 'item123', itemQuantity: 2, itemSeller: 'sellerX' }], 'invoiceDetails');
        orderId = createRes.data.orderId;
        expect(orderId).toStrictEqual(expect.any(String)); // Make sure we have an orderId
    }));
    test('successful order cancellation', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the request and response for the cancelOrder controller method
        const req = {
            body: { orderUid: orderId },
            header: jest.fn().mockReturnValue('testToken') // Mock the token header
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Call the cancelOrder controller method
        //    await cancelOrder(req, res);
        // Check that the response is as expected
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Order canceled successfully' });
        // Verify the order is no longer found in the repository
        const repo = new OrderRepository_1.OrderRepository();
        const find = repo.findByOrderUid(orderId);
        expect(find === null || find === void 0 ? void 0 : find.status).toBe('Deleted'); // The order should have been marked as 'Deleted'
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server); // Ensure the server is closed after the tests
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
