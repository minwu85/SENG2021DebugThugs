import { expect } from '@jest/globals';
import { server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer, createOrderReq } from '../testHelper'
import { retrieveOrder } from "../testHelper"
import { registerUserRequest } from '../testHelper'


describe('registerUser', () => {
  // beforeEach(() => {
  //   // insert clear function
  // });

  test('successful registration', async () => {
    const mockOrderData = {
        itemId: 'itemId1',
        itemQuantity: 4,
        itemSeller: 'seller1'
    }
  //   const mockRegisterResponse = {
  //     data: {
  //         token: 'testToken'
  //     }
  // };

  // const mockCreateOrderResponse = {
  //     data: {
  //         result: 'testOrderUid'
  //     }
  // };

  // mockedAxios.post.mockResolvedValueOnce(mockRegisterResponse);
  // mockedAxios.post.mockResolvedValueOnce(mockCreateOrderResponse);

      const res = await registerUserRequest('uName', 'pWord', 'email@email.com');
      expect(res.status).toBe(200);
      expect(res.data).toStrictEqual(expect.any(String));
      const token = res.data;
      console.log(res.data);

      // // check that person was pushed into person repo and token into session
      // const repoP = new PersonRepository;
      // const findPerson = repoP.findByUsername('uName');
      // expect(findPerson).not.toBeNull();
      // expect(findPerson).toBeDefined();

      // const repoS = new SessionRepository;
      // const findSession = repoS.findPersonUidFromToken(token);
      // // expect(findSession).toStrictEqual(expect.any(String));


      
      const order1 =  createOrderReq(
        token, 
        'personUId test', 
        [mockOrderData], 
        'details'
      );





    // const result = await retrieveOrder(order1.data.result, token)
    // expect(result.statusCode).toStrictEqual(200);
    // expect(order1.data).toStrictEqual(mockOrderData);
  });

  afterAll(async () => {
    await closeServer(server);
  });
});