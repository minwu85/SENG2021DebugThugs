"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.Order = void 0;
class Order {
    constructor(orderUid, // GUID Unique ID
    personUid, // GUID of Person
    status, itemList, invoiceDetails, // Additional fields for invoice data, etc.
    xml // the xml for the order
    ) {
        this.orderUid = orderUid;
        this.personUid = personUid;
        this.status = status;
        this.itemList = itemList;
        this.invoiceDetails = invoiceDetails;
        this.xml = xml;
    }
}
exports.Order = Order;
class Item {
    constructor(itemId, // id for item
    itemQuantity, itemSeller, // GUID of seller
    itemType, // colour, version, etc.
    itemPrice, priceDiscount) {
        this.itemId = itemId;
        this.itemQuantity = itemQuantity;
        this.itemSeller = itemSeller;
        this.itemType = itemType;
        this.itemPrice = itemPrice;
        this.priceDiscount = priceDiscount;
    }
}
exports.Item = Item;
