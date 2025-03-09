import test, { beforeEach, describe } from "node:test";
import { Item } from "../../domain/Order";

// temporary test, will fix to be blackbox when admin routes are created
describe('createOrder', () => {
  beforeEach(() => {
    // insert clear function
  });

  test('successful order creation', () => {
    //

  });
});

function createOrder(
  token: string,
  personUid: string,
  itemList?: Item[],
  invoiceDetails?: any
  ) {
    //
}