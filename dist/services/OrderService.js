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
exports.OrderService = void 0;
const OrderRepository_1 = require("../repository/OrderRepository");
const Order_1 = require("../domain/Order");
const uuid_1 = require("uuid");
const ServicesHelper_1 = require("./ServicesHelper");
var convert = require('xml-js');
class OrderService {
    constructor() {
        this.orderRepo = new OrderRepository_1.OrderRepository();
    }
    /**
     * create an order
     * @param {object} itemList
     * @param {string} token
     * @param {string} personUid
     * @returns {string} orderId
    */
    createOrder(token, personUid, itemList, invoiceDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate token and personUid
            const validateToken = new ServicesHelper_1.Validation();
            try {
                validateToken.validateToken(token, personUid);
            }
            catch (error) {
                throw new Error('Invalid token');
            }
            // create orderUid
            const orderUid = (0, uuid_1.v4)();
            // create new Order and save to repo
            const newOrder = new Order_1.Order(orderUid, personUid, 'Pending', itemList, invoiceDetails);
            this.orderRepo.save(newOrder);
            return orderUid;
        });
    }
    /**
     * converts and order to xml
     * @param {string} orderUid
     * @returns {string} xml
    */
    fetchXml(orderUid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const order = this.orderRepo.findByOrderUid(orderUid);
            if (!order) {
                throw new Error('Order does not exist');
            }
            const orderFormatted = {
                orderUid: order.orderUid,
                personUid: order.personUid,
                status: order.status,
                itemList: (_a = order.itemList) === null || _a === void 0 ? void 0 : _a.map(item => ({
                    item: {
                        itemId: item.itemId,
                        itemQuantity: item.itemQuantity,
                        itemSeller: item.itemSeller,
                        itemType: item.itemType,
                        itemPrice: item.itemPrice,
                        priceDiscount: item.priceDiscount
                    }
                })),
                invoiceDetails: order.invoiceDetails
            };
            var xmlOptions = { compact: true, ignoreComment: true, spaces: 4 };
            const orderXml = convert.json2xml(orderFormatted, xmlOptions);
            order.xml = orderXml;
            return orderXml;
        });
    }
    getOrderByUid(orderUid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderRepo.findByOrderUid(orderUid);
        });
    }
    getAllOrdersByPersonUid(personUid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderRepo.findAllByPersonUid(personUid);
        });
    }
    cancelOrder(orderUid) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = this.orderRepo.findByOrderUid(orderUid);
            if (!order || order.status === 'Deleted') {
                return false;
            }
            order.status = 'Deleted';
            return true;
        });
    }
}
exports.OrderService = OrderService;
