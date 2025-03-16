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
exports.closeServer = closeServer;
exports.registerUserRequest = registerUserRequest;
exports.loginUserRequest = loginUserRequest;
exports.createOrder = createOrder;
exports.fetchXmlRequest = fetchXmlRequest;
exports.logoutUserReq = logoutUserReq;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const SERVER_URL = `http://localhost:${index_1.PORT}`;
// close server
function closeServer(server) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Closing server after tests...');
        yield new Promise((resolve) => setTimeout(resolve, 500));
        yield new Promise((resolve) => server.close(() => resolve()));
    });
}
// register a user
function registerUserRequest(username, password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.post(`${SERVER_URL}/api/person/v1/registerUser`, {
                username, password, email
            }, {
                timeout: 5 * 1000
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
// logs in a user
function loginUserRequest(userInput, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.post(`${SERVER_URL}/api/person/v1/loginUser`, {
                userInput, password
            }, {
                timeout: 5 * 1000
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
function createOrder(token, personUid, itemList, invoiceDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.post(`${SERVER_URL}/api/order/v1/order/create`, {
                personUid, itemList, invoiceDetails
            }, {
                headers: { token },
                timeout: 5 * 1000
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
function fetchXmlRequest(orderUid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.get(`${SERVER_URL}/api/order/v1/order/fetchxml${orderUid}`);
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
function logoutUserReq(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.delete(`${SERVER_URL}/api/person/v1/logoutUser`, {
                headers: { token },
                timeout: 5 * 1000
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    });
}
