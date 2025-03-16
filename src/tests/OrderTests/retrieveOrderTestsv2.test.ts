import { server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer } from '../testHelper'
import {createOrder,retrieveOrder } from "../testHelper"
import { registerUserRequest } from '../testHelper'
import { expect } from '@jest/globals';

describe('registerUser', () => {
  beforeEach(() => {
    // insert clear function
  });

  test('successful registration', async () => {
    const mockOrderData = {
        itemId: 'itemId1',
        itemQuantity: 4,
        itemSeller: 'seller1'
    }
      const res = await registerUserRequest('uName', 'pWord', 'email@email.com');

      expect(res.status).toBe(200);
      expect(res.data).toStrictEqual(expect.any(String));
      const token = res.data;

      // check that person was pushed into person repo and token into session
      const repoP = new PersonRepository;
      const findPerson = repoP.findByUsername('uName');
      expect(findPerson).not.toBeNull();
      expect(findPerson).toBeDefined();

      const repoS = new SessionRepository;
      const findSession = repoS.findPersonUidFromToken(res.data);
      expect(findSession).toStrictEqual(expect.any(String));

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

  afterAll(async () => {
    await closeServer(server);
  });
});