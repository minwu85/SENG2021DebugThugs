"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
class OrderRepository {
    constructor() {
        this.orders = new Map();
    }
    save(order) {
        OrderRepository.orders.push(order);
        return order;
    }
    findByOrderUid(orderUid) {
        return OrderRepository.orders.find(o => o.orderUid === orderUid) || null;
    }
    findAllByPersonUid(personUid) {
        return OrderRepository.orders.filter(o => o.personUid === personUid);
    }
    clear() {
        OrderRepository.orders = []; // Clears all stored orders
    }
    findAll() {
        return this.orders;
    }
}
exports.OrderRepository = OrderRepository;
OrderRepository.orders = [];
