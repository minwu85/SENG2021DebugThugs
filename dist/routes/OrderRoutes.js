"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const OrderRepository_1 = require("../repository/OrderRepository");
const router = (0, express_1.Router)();
// POST /api/order
// router.post('/', saveOrder);
router.post('/v1/order/create', OrderController_1.createOrder);
// GET /api/order/:invoiceUid
// router.get('/:invoiceUid', getOrderByInvoiceUid);
router.get('/v1/order/fetchxml:orderUid', OrderController_1.fetchXml);
// GET /api/order/person/:personUid
router.get('/person/:personUid', OrderController_1.getAllOrdersByPersonUid);
// GET /api/order/cancel
router.delete('/v1/order/cancel', OrderController_1.cancelOrder);
console.log('Cancel order route registered');
// DELETE /v1/clear
router.delete('/v1/clear', (req, res) => {
    try {
        const repo = new OrderRepository_1.OrderRepository();
        repo.clear(); // Clear all stored orders
        res.status(200).json({ message: 'Database cleared successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
console.log('Clear database route registered');
// DELETE /api/order/clear
router.delete('/v1/clear', OrderController_1.clearOrder);
console.log('Clear order route registered');
exports.default = router;
