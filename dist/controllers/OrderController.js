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
exports.clearOrder = exports.cancelOrder = exports.getAllOrdersByPersonUid = void 0;
exports.createOrder = createOrder;
exports.getOrderByInvoiceUid = getOrderByInvoiceUid;
exports.fetchXml = fetchXml;
const OrderService_1 = require("../services/OrderService");
const OrderRepository_1 = require("../repository/OrderRepository");
const orderService = new OrderService_1.OrderService();
// POST /api/order
// createOrder
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('token');
        const { personUid, itemList, invoiceDetails } = req.body;
        if (!token) {
            res.status(401).json({ error: 'Token is required' });
        }
        try {
            const result = yield orderService.createOrder(token, personUid, itemList, invoiceDetails);
            res.status(200).json({ result });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
            else {
                res.status(400).json({ message: 'Unknown error' });
            }
        }
    });
}
// GET /api/order/:invoiceUid
function getOrderByInvoiceUid(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { invoiceUid } = req.params;
            const order = yield orderService.getOrderByUid(invoiceUid);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            return res.json(order);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to get order' });
        }
    });
}
function fetchXml(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { orderUid } = req.params;
        try {
            const result = yield orderService.fetchXml(orderUid);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json(error.message);
            }
            else {
                return res.status(500).json('Unknown error');
            }
        }
    });
}
// GET /api/order/person/:personUid
const getAllOrdersByPersonUid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { personUid } = req.params;
        const repo = new OrderRepository_1.OrderRepository();
        // Use the correct method: findAllByPersonUid
        const orders = repo.findAllByPersonUid(personUid);
        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllOrdersByPersonUid = getAllOrdersByPersonUid;
// DELETE /api/order/cancel
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderUid } = req.body;
        const repo = new OrderRepository_1.OrderRepository();
        const order = repo.findByOrderUid(orderUid);
        if (!order || order.status === 'Deleted') {
            res.status(400).json({ error: 'Order not found or already canceled' });
            return;
        }
        order.status = 'Deleted';
        res.status(200).json({ message: 'Order canceled successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        throw error;
    }
});
exports.cancelOrder = cancelOrder;
// DELETE /api/order/clear
const clearOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = new OrderRepository_1.OrderRepository();
        repo.clear();
        res.status(200).json({ message: 'All orders cleared successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.clearOrder = clearOrder;
