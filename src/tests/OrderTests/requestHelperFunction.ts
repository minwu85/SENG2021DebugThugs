import request from 'sync-request-curl';
import { Item, Order } from "../../domain/Order";
import axios from 'axios';
import { PORT } from '../../index';
import { OrderRepository } from "../../repository/OrderRepository";


const SERVER_URL = `http://localhost:${PORT}`;

async function createOrder(
    token: string,
    personUid: string,
    itemList?: Item[],
    invoiceDetails?: any
    ) {
      try {
        const res = await axios.post(
          `${SERVER_URL}/api/order/v1/order/create`,
          {
            personUid, itemList, invoiceDetails
          },
          {
            headers: { token },
            timeout: 5 * 1000
          }
        );
        return res;
      } catch (error) {
        throw error;
      }
  }
