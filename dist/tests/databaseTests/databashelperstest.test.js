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
const DatabaseConnection_1 = require("../../database/DatabaseConnection");
const databaseHelpers_1 = require("../../database/databaseHelpers");
const Person_1 = require("../../domain/Person");
const Order_1 = require("../../domain/Order");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, DatabaseConnection_1.initDB)();
    console.log('Test Database Initialized.');
    // Clean up existing data before running tests
    yield DatabaseConnection_1.pool.query('DELETE FROM sessions');
    yield DatabaseConnection_1.pool.query('DELETE FROM items');
    yield DatabaseConnection_1.pool.query('DELETE FROM orders');
    yield DatabaseConnection_1.pool.query('DELETE FROM persons');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, DatabaseConnection_1.closeDB)();
    console.log('Test Database Closed.');
}));
describe('Database Helper Functions', () => {
    let personUid;
    let orderUid;
    let sessionToken;
    test('savePerson should insert and retrieve a person', () => __awaiter(void 0, void 0, void 0, function* () {
        personUid = '1234-5678-9012';
        const person = new Person_1.Person(personUid, 'testuser', 'password123', 'test@example.com');
        yield (0, databaseHelpers_1.savePerson)(person);
        const [rows] = yield DatabaseConnection_1.pool.query('SELECT * FROM persons WHERE personUid = ?', [personUid]);
        expect(rows.length).toBe(1);
        expect(rows[0].username).toBe('testuser');
        expect(rows[0].email).toBe('test@example.com');
    }));
    test('saveOrder should insert and retrieve an order with items', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        orderUid = 'abcd-efgh-ijkl';
        const items = [
            new Order_1.Item('item-1', 2, 'seller1', { category: 'electronics' }, 20.5, 5),
            new Order_1.Item('item-2', 1, 'seller2', { category: 'books' }, 10.0, 2),
        ];
        const order = new Order_1.Order(orderUid, personUid, 'Pending', items, { total: 50 }, '<xml>test</xml>');
        yield (0, databaseHelpers_1.saveOrder)(order);
        const retrievedOrder = yield (0, databaseHelpers_1.getOrder)(orderUid);
        expect(retrievedOrder).not.toBeNull();
        expect(retrievedOrder === null || retrievedOrder === void 0 ? void 0 : retrievedOrder.status).toBe('Pending');
        expect((_a = retrievedOrder === null || retrievedOrder === void 0 ? void 0 : retrievedOrder.itemList) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
        expect((_b = retrievedOrder === null || retrievedOrder === void 0 ? void 0 : retrievedOrder.invoiceDetails) === null || _b === void 0 ? void 0 : _b.total).toBe(50);
    }));
    test('saveSession should insert and retrieve a session', () => __awaiter(void 0, void 0, void 0, function* () {
        sessionToken = 'session-1234';
        const session = new Person_1.Session(sessionToken, personUid);
        yield (0, databaseHelpers_1.saveSession)(session);
        const retrievedSession = yield (0, databaseHelpers_1.getSession)(sessionToken);
        expect(retrievedSession).not.toBeNull();
        expect(retrievedSession === null || retrievedSession === void 0 ? void 0 : retrievedSession.personUid).toBe(personUid);
    }));
});
