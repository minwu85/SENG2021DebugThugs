import { Item, Order } from "../../domain/Order";
import axios from 'axios';
import { PORT } from '../../index';
import { OrderRepository } from "../../repository/OrderRepository";
import { createOrder } from "./createOrder.test"
const SERVER_URL = `http://localhost:${PORT}`;

describe('retrieveOrder', async () => {
    beforeEach(() => {
        // clear
    });

    test('successful order retrieval', async () => {
        const token = registerUserRequest()
        
        const result = retrieveOrder(
            createOrder(
                token, 
                'personUId test', 
                [
                    {
                    itemId: 'itemId',
                    itemQuantity: 2,
                    itemSeller: 'seller'
                    }
                ], 
                'details'),
            token,
        );

        expect(result.statusCode).toStrictEqual(200);
    });


    test('', async () => {

    });
    test('', async () => {

    });
    test('', async () => {

    });
});

export async function retrieveOrder(orderUid: string, token: string) {
    try {
        const res = await axios.get(
            `${SERVER_URL}/order/create/test/${orderUid}`,
            {
                headers: {token},
                timeout: 5 * 1000
            }
        );
        return res.data;
    } catch (error) {
       throw error;        
    }
}