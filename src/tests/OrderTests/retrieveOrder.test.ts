import { Item, Order } from "../../domain/Order";
import axios from 'axios';
import { jest } from '@jest/globals';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { OrderRepository } from "../../repository/OrderRepository";
import {createOrder,retrieveOrder } from "../testHelper"
import { server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer } from '../testHelper'
import { registerUserRequest } from '../testHelper'
import { expect } from '@jest/globals';



const mockOrderData = {
    itemId: 'itemId1',
    itemQuantity: 4,
    itemSeller: 'seller1'
};


describe('retrieveOrder', () => {
    // let token: string;
    beforeEach(async () => {
        jest.clearAllMocks();

    });

    afterAll(async () => {
        await closeServer(server);
    });


    // no working rn
    test('successful order retrieval', async () => {
        const mockOrderData = {
            itemId: 'itemId1',
            itemQuantity: 4,
            itemSeller: 'seller1'
        }
        const res = await registerUserRequest('uName', 'pWord', 'email@email.com');
        expect(res.status).toBe(200);
        expect(res.data).toStrictEqual(expect.any(String));
        console.log('Registration response:', res);
        const token = res.data;
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



/////////////////////////////////////////////////////


// import { Item, Order } from "../../domain/Order";
// import axios from 'axios';
// import { jest } from '@jest/globals';
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;
// import { OrderRepository } from "../../repository/OrderRepository";
// import { closeServer, createOrder, registerUserRequest, retrieveOrder } from "../testHelper";
// import { PORT, server } from "../..";
// const SERVER_URL = `http://localhost:${PORT}`;

// const mockOrderData = {
//     itemId: 'itemId1',
//     itemQuantity: 4,
//     itemSeller: 'seller1'
// };

// describe('retrieveOrder', () => {
//     let orderRepository: OrderRepository;

//     beforeEach(() => {
//         jest.clearAllMocks();
//         orderRepository = new OrderRepository();
//     });

//     afterAll(async () => {
//         await closeServer(server);
//     });

//     test('successful order retrieval', async () => {
//         const mockRegisterResponse = {
//             data: {
//                 token: 'testToken'
//             }
//         };
//         const mockCreateOrderResponse = {
//             data: {
//                 result: 'testOrderUid'
//             }
//         };
//         const mockRetrieveOrderResponse = {
//             statusCode: 200,
//             data: mockOrderData
//         };

//         mockedAxios.post.mockResolvedValueOnce(mockRegisterResponse);
//         mockedAxios.post.mockResolvedValueOnce(mockCreateOrderResponse);
//         mockedAxios.get.mockResolvedValueOnce({ data: mockRetrieveOrderResponse });

//         const token = (await registerUserRequest('uName', 'pWord', 'email@email.com')).data.token;
//         const order1 = await createOrder(
//             token,
//             'personUId test',
//             [mockOrderData],
//             'details'
//         );

//         const result = await retrieveOrder(order1.data.result, token);
//         expect(result.statusCode).toStrictEqual(200);
//         expect(result.data).toStrictEqual(mockOrderData);

//         // Check the order in the repository
//         const storedOrder = await orderRepository.findByOrderUid(order1.data.result);
//         expect(storedOrder).toBeDefined();
//         expect(storedOrder?.itemList).toStrictEqual([mockOrderData]);
//     });

//     test('successful order retrieval with hardcoded values', async () => {
//         const orderUid = 'testOrderUid';
//         const token = 'testToken';
//         const mockResponseData = {
//             statusCode: 200,
//             data: {
//                 itemId: 'itemId2',
//                 itemQuantity: 5,
//                 itemSeller: 'seller2'
//             }
//         };

//         mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

//         const result = await retrieveOrder(orderUid, token);
//         expect(result).toStrictEqual(mockResponseData);
//     });

//     test('order not found', async () => {
//         const mockError = {
//             response: {
//                 status: 404,
//                 data: 'Order not found'
//             }
//         };

//         mockedAxios.get.mockRejectedValueOnce(mockError);

//         try {
//             await retrieveOrder('wrongOrderUid', 'testToken');
//             fail('Did not throw expected error');
//         } catch (error) {
//             if (axios.isAxiosError(error) && error.response) {
//                 expect(error.response.status).toBe(404);
//                 expect(error.response.data).toBe('Order not found');
//             } else {
//                 throw error;
//             }
//         }
//     });

//     test('invalid token', async () => {
//         const mockError = {
//             response: {
//                 status: 401,
//                 data: 'Invalid token'
//             }
//         };

//         mockedAxios.get.mockRejectedValueOnce(mockError);

//         try {
//             await retrieveOrder('testOrderUid', 'invalidToken');
//             fail('Did not throw expected error');
//         } catch (error) {
//             if (axios.isAxiosError(error) && error.response) {
//                 expect(error.response.status).toBe(401);
//                 expect(error.response.data).toBe('Invalid token');
//             } else {
//                 throw error;
//             }
//         }
//     });

//     test('server error', async () => {
//         const mockError = {
//             response: {
//                 status: 500,
//                 data: 'Internal server error'
//             }
//         };

//         mockedAxios.get.mockRejectedValueOnce(mockError);

//         try {
//             await retrieveOrder('testOrderUid', 'testToken');
//             fail('Did not throw expected error');
//         } catch (error) {
//             if (axios.isAxiosError(error) && error.response) {
//                 expect(error.response.status).toBe(500);
//                 expect(error.response.data).toBe('Internal server error');
//             } else {
//                 throw error;
//             }
//         }
//     });
// });