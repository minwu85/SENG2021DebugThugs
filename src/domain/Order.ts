export class Order {
  constructor(
    public orderUid: string,      // GUID Unique ID
    public personUid: string,     // GUID of Person
    public status: 'Pending' | 'Completed' | 'Deleted',
    public itemList?: Item[], 
    public invoiceDetails?: any,   // Additional fields for invoice data, etc.
    public xml?: string           // the xml for the order
  ) {}
}

export class Item {
  constructor(
    public itemId: string,         // id for item
    public itemQuantity: number,
    public itemSeller: string,     // GUID of seller
    public itemType?: any,         // colour, version, etc.
    public itemPrice?: number,
    public priceDiscount?: number,
  ) {}
}