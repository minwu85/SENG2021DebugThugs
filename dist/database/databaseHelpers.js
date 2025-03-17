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
exports.savePerson = savePerson;
exports.saveOrder = saveOrder;
exports.getOrder = getOrder;
exports.saveSession = saveSession;
exports.getSession = getSession;
const DatabaseConnection_1 = require("./DatabaseConnection"); // Adjust path
const Person_1 = require("../domain/Person"); // Adjust path
const Order_1 = require("../domain/Order"); // Adjust path
function savePerson(person) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `
    INSERT INTO persons (personUid, username, password, email)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      username = VALUES(username),
      password = VALUES(password),
      email = VALUES(email)
  `;
        const params = [
            person.personUid,
            person.username,
            person.password,
            person.email
        ];
        yield DatabaseConnection_1.pool.query(sql, params);
    });
}
function saveOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield DatabaseConnection_1.pool.getConnection();
        try {
            yield connection.beginTransaction();
            // Insert or update the order
            const orderSql = `
      INSERT INTO orders (orderUid, personUid, status, invoiceDetails, xml)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        personUid = VALUES(personUid),
        status = VALUES(status),
        invoiceDetails = VALUES(invoiceDetails),
        xml = VALUES(xml)
    `;
            const orderParams = [
                order.orderUid,
                order.personUid,
                order.status,
                order.invoiceDetails ? JSON.stringify(order.invoiceDetails) : null,
                order.xml || null
            ];
            yield connection.query(orderSql, orderParams);
            // Optional: clear old items if re-saving
            const deleteItemsSql = `DELETE FROM items WHERE orderUid = ?`;
            yield connection.query(deleteItemsSql, [order.orderUid]);
            // Insert new items
            if (order.itemList && order.itemList.length > 0) {
                const itemSql = `
        INSERT INTO items (
          orderUid, itemId, itemQuantity, itemSeller, itemType, itemPrice, priceDiscount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
                for (const item of order.itemList) {
                    const itemParams = [
                        order.orderUid,
                        item.itemId,
                        item.itemQuantity,
                        item.itemSeller,
                        item.itemType ? JSON.stringify(item.itemType) : null,
                        item.itemPrice || null,
                        item.priceDiscount || null
                    ];
                    yield connection.query(itemSql, itemParams);
                }
            }
            yield connection.commit();
        }
        catch (err) {
            yield connection.rollback();
            throw err;
        }
        finally {
            connection.release();
        }
    });
}
function getOrder(orderUid) {
    return __awaiter(this, void 0, void 0, function* () {
        const [orderRows] = yield DatabaseConnection_1.pool.query(`
    SELECT orderUid, personUid, status, invoiceDetails, xml
    FROM orders
    WHERE orderUid = ?
  `, [orderUid]);
        if (orderRows.length === 0) {
            return null;
        }
        const row = orderRows[0];
        // Fetch items
        const [itemRows] = yield DatabaseConnection_1.pool.query(`
    SELECT itemId, itemQuantity, itemSeller, itemType, itemPrice, priceDiscount
    FROM items
    WHERE orderUid = ?
  `, [orderUid]);
        const items = itemRows.map((r) => {
            return new Order_1.Item(r.itemId, r.itemQuantity, r.itemSeller, r.itemType ? JSON.parse(r.itemType) : undefined, r.itemPrice, r.priceDiscount);
        });
        const order = new Order_1.Order(row.orderUid, row.personUid, row.status, items, row.invoiceDetails ? JSON.parse(row.invoiceDetails) : undefined, row.xml);
        return order;
    });
}
function saveSession(session) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `
    INSERT INTO sessions (token, personUid)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      personUid = VALUES(personUid)
  `;
        yield DatabaseConnection_1.pool.query(sql, [session.token, session.personUid]);
    });
}
function getSession(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield DatabaseConnection_1.pool.query(`
    SELECT token, personUid
    FROM sessions
    WHERE token = ?
  `, [token]);
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return new Person_1.Session(row.token, row.personUid);
    });
}
