import { expect } from '@jest/globals';
import { server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer, createOrderReq } from '../testHelper'
import { retrieveOrder } from "../testHelper"
import { registerUserRequest } from '../testHelper'


describe('registerUser', () => {
  let token;
  let personUid;
  beforeEach(async () => {
    // insert clear function
    // const register = await registerUserRequest('user', 'password', 'email');
    // const token = register.data;
    const sessionRepo = new SessionRepository();
    personUid = sessionRepo.findPersonUidFromToken(token);
  });

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
      // expect(res.status).toBe(200);
      // expect(res.data).toStrictEqual(expect.any(String));
      const token = res.data;
      // console.log(res.data);

      // // check that person was pushed into person repo and token into session
      // const repoP = new PersonRepository;
      // const findPerson = repoP.findByUsername('uName');
      // expect(findPerson).not.toBeNull();
      // expect(findPerson).toBeDefined();

      // const repoS = new SessionRepository();
      // const personUid = repoS.findPersonUidFromToken(token);
      // expect(findSession).toStrictEqual(expect.any(String));

    const order = await createOrderReq(
      token,
      personUid,
      [
        {
          itemId: 'itemId',
          itemQuantity: 2,
          itemSeller: 'seller'
        }
      ],
      'details'
    )
      
      // const order1 =  createOrderReq(
      //   token, 
      //   'personUId test', 
      //   [mockOrderData], 
      //   'details'
      // );





    // const result = await retrieveOrder(order1.data.result, token)
    // expect(result.statusCode).toStrictEqual(200);
    // expect(order1.data).toStrictEqual(mockOrderData);
  });

  afterAll(async () => {
    await closeServer(server);
  });
});



// describe('fetchXml', () => {
//   let token;
//   let personUid;
//   let orderUid;
//   beforeEach(async () => {
//     // insert clear function

//     // register user
//     const register = await registerUserRequest('user', 'password', 'email');
//     token = register.data;
//     const sessionRepo = new SessionRepository();
//     personUid = sessionRepo.findPersonUidFromToken(token);
    

//   });

//   test('successful xml return', async () => {
//     const mockOrderData = {
//       itemId: 'itemId1',
//       itemQuantity: 4,
//       itemSeller: 'seller1'
//     }
//     const order1 = await createOrderReq(
//       token,
//       personUid,
//       [
//         {
//           itemId: 'itemId',
//           itemQuantity: 2,
//           itemSeller: 'seller'
//         }
//       ],
//       'details'
//     );
//     const result = await retrieveOrder(order1.data.result, token)
//     expect(result.statusCode).toStrictEqual(200);
//     expect(order1.data).toStrictEqual(mockOrderData);
//   });

//   afterAll(async () => {
//     await closeServer(server);
//   });
// });