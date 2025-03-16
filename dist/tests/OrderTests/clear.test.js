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
const SERVER_URL = `http://localhost:${index_1.PORT}`;
describe('clearOrder', () => {
    test('successful order clearing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield axios_1.default.delete(`${SERVER_URL}/api/order/v1/clear`);
        expect(res.status).toBe(200);
        expect(res.data).toEqual({ message: 'All orders cleared successfully' });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, testHelper_1.closeServer)(index_1.server);
    }));
});
