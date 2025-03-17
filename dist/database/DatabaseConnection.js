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
exports.pool = void 0;
exports.initDB = initDB;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.pool = promise_1.default.createPool({
    host: 'debug-thugs-db.c568c4wg0fr2.ap-southeast-2.rds.amazonaws.com',
    user: 'debugthugs',
    password: 'DebugThugs2021',
    database: 'debugthugsdb',
    port: 3306,
    // optional config
    connectionLimit: 10,
    waitForConnections: true,
});
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // You can run your CREATE TABLE statements here or keep them in a migration script
        const createPersons = `
    CREATE TABLE IF NOT EXISTS persons (
      personUid VARCHAR(36) PRIMARY KEY,
      username  VARCHAR(100) NOT NULL,
      password  VARCHAR(100) NOT NULL,
      email     VARCHAR(100) NOT NULL
    )`;
        const createOrders = `
    CREATE TABLE IF NOT EXISTS orders (
      orderUid       VARCHAR(36) PRIMARY KEY,
      personUid      VARCHAR(36) NOT NULL,
      status         ENUM('Pending', 'Completed', 'Deleted') NOT NULL,
      invoiceDetails JSON NULL,
      xml            TEXT NULL,
      FOREIGN KEY (personUid) REFERENCES persons(personUid)
    )`;
        const createItems = `
    CREATE TABLE IF NOT EXISTS items (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      orderUid       VARCHAR(36) NOT NULL,
      itemId         VARCHAR(36) NOT NULL,
      itemQuantity   INT NOT NULL,
      itemSeller     VARCHAR(36) NOT NULL,
      itemType       JSON NULL,
      itemPrice      DECIMAL(10, 2) NULL,
      priceDiscount  DECIMAL(10, 2) NULL,
      FOREIGN KEY (orderUid) REFERENCES orders(orderUid)
    )`;
        const createSessions = `
    CREATE TABLE IF NOT EXISTS sessions (
      token     VARCHAR(100) PRIMARY KEY,
      personUid VARCHAR(36) NOT NULL,
      FOREIGN KEY (personUid) REFERENCES persons(personUid)
    )`;
        yield exports.pool.query(createPersons);
        yield exports.pool.query(createOrders);
        yield exports.pool.query(createItems);
        yield exports.pool.query(createSessions);
    });
}
