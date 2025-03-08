export class Order {
    constructor(
      public orderUid: string,      // GUID Unique ID
      public personUid: string,     // GUID of Person
      public status: 'Pending' | 'Completed' | 'Deleted',
      public invoiceDetails?: any   // Additional fields for invoice data, etc.
    ) {}
  }
  