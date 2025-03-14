import { Item, Order } from "../../domain/Order";
import axios from 'axios';
import { jest } from '@jest/globals';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { OrderRepository } from "../../repository/OrderRepository";
import { createOrder, registerUserRequest, retrieveOrder } from "../testHelper"
import { PORT } from "../..";
const SERVER_URL = `http://localhost:${PORT}`;



describe('retrieveOrder', () => {
    // let token: string;
    beforeEach(async () => {


    });
    // no working rn
    test('successful order retrieval', async () => {
        const mockOrderData = {
            itemId: 'itemId1',
            itemQuantity: 4,
            itemSeller: 'seller1'
        }
        const reg = await registerUserRequest('uName', 'pWord', 'email@email.com');
        const token = reg.data;
        // const token = (await registerUserRequest('uName', 'pWord', 'email@email.com')).data;
        const order1 = await createOrder(
            token, 
            'personUId test', 
            [mockOrderData], 
            'details'
        );


        const result = await retrieveOrder(order1.data.result, token)
        expect(result.statusCode).toStrictEqual(200);
        expect(order1.data).toStrictEqual(mockOrderData);
    });

    test('successful order retrieval with hardcoded values', async () => {
        const orderUid = 'testOrderUid';
        const token = 'testToken';
        const mockResponseData = {
            statusCode: 200,
            data: {
                itemId: 'itemId2',
                itemQuantity: 5,
                itemSeller: 'seller2'
            }
        };

        mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

        const result = await retrieveOrder(orderUid, token);
        expect(result).toStrictEqual(mockResponseData);
    });

    // test('order does not exist', async () => {
    //     const orderUid = 'wrongOrderUid';
    //     const token = 'testToken';
    //     const mockResponseData = {
    //         statusCode: 500,
    //         data: 'error'
    //     };

    //     mockedAxios.get.mockRejectedValueOnce({ response: mockResponseData });
    //     const result = await retrieveOrder(orderUid, token);
    //     expect(result).toStrictEqual(mockResponseData);
    
    // });
});
