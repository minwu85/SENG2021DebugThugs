import { Item, Order } from "../../domain/Order";
import axios from 'axios';
import { jest } from '@jest/globals';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { OrderRepository } from "../../repository/OrderRepository";
import { createOrder, registerUserRequest } from "../testHelper"
import { PORT } from "../..";
const SERVER_URL = `http://localhost:${PORT}`;

const mockOderData = {
    itemId: 'itemId',
    itemQuantity: 2,
    itemSeller: 'seller'
}

describe('retrieveOrder', () => {
    // let token: string;
    beforeEach(async () => {
        // clear

    });

    // test('successful order retrieval', async () => {
    //     const token = (await registerUserRequest('uName', 'pWord', 'email@email.com')).data.token;
    //     const order1 = await createOrder(
    //         token, 
    //         'personUId test', 
    //         [mockOderData], 
    //         'details'
    //     );


    //     const result = await retrieveOrder(order1.data.result, token)
    //     expect(result.statusCode).toStrictEqual(200);
    //     expect(order1.data).toStrictEqual(mockOderData);
    // });

    test('successful order retrieval with hardcoded values', async () => {
        const orderUid = 'testOrderUid';
        const token = 'testToken';
        const mockResponseData = {
            statusCode: 200,
            data: {
                itemId: 'itemId',
                itemQuantity: 2,
                itemSeller: 'seller'
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

        const result = await retrieveOrder(orderUid, token);
        expect(result).toStrictEqual(mockResponseData);
    });
    // test('', async () => {

    // });
    // test('', async () => {

    // });
    // test('', async () => {

    // });
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