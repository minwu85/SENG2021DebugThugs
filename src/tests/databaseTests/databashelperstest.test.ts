import { pool, initDB, closeDB } from '../../database/DatabaseConnection';
import { savePerson, getOrder, saveOrder, saveSession, getSession } from '../../database/databaseHelpers';
import { Person, Session } from '../../domain/Person';
import { Order, Item } from '../../domain/Order';

beforeAll(async () => {
  await initDB();
  console.log('Test Database Initialized.');

  // Clean up existing data before running tests
  await pool.query('DELETE FROM sessions');
  await pool.query('DELETE FROM items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM persons');
});

afterAll(async () => {
  await closeDB();
  console.log('Test Database Closed.');
});

describe('Database Helper Functions', () => {
  let personUid: string;
  let orderUid: string;
  let sessionToken: string;

  test('savePerson should insert and retrieve a person', async () => {
    personUid = '1234-5678-9012';
    const person = new Person(personUid, 'testuser', 'password123', 'test@example.com');

    await savePerson(person);

    const [rows]: any = await pool.query('SELECT * FROM persons WHERE personUid = ?', [personUid]);
    expect(rows.length).toBe(1);
    expect(rows[0].username).toBe('testuser');
    expect(rows[0].email).toBe('test@example.com');
  });

  test('saveOrder should insert and retrieve an order with items', async () => {
    orderUid = 'abcd-efgh-ijkl';
    const items: Item[] = [
      new Item('item-1', 2, 'seller1', { category: 'electronics' }, 20.5, 5),
      new Item('item-2', 1, 'seller2', { category: 'books' }, 10.0, 2),
    ];

    const order = new Order(orderUid, personUid, 'Pending', items, { total: 50 }, '<xml>test</xml>');
    await saveOrder(order);

    const retrievedOrder = await getOrder(orderUid);
    expect(retrievedOrder).not.toBeNull();
    expect(retrievedOrder?.status).toBe('Pending');
    expect(retrievedOrder?.itemList?.length).toBe(2);
    expect(retrievedOrder?.invoiceDetails?.total).toBe(50);
  });

  test('saveSession should insert and retrieve a session', async () => {
    sessionToken = 'session-1234';
    const session = new Session(sessionToken, personUid);

    await saveSession(session);

    const retrievedSession = await getSession(sessionToken);
    expect(retrievedSession).not.toBeNull();
    expect(retrievedSession?.personUid).toBe(personUid);
  });
});