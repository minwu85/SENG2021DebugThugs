import { pool } from './DatabaseConnection'; // Adjust path
import { Person, Session } from '../domain/Person'; // Adjust path
import { Order, Item } from '../domain/Order'; // Adjust path

export async function savePerson(person: Person): Promise<void> {
  const sql = `
    INSERT INTO persons (personUid, username, password, email)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      username = VALUES(username),
      password = VALUES(password),
      email = VALUES(email)
  `;
  const params = [
    person.personUid,
    person.username,
    person.password,
    person.email
  ];
  await pool.query(sql, params);
}

export async function saveOrder(order: Order): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert or update the order
    const orderSql = `
      INSERT INTO orders (orderUid, personUid, status, invoiceDetails, xml)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        personUid = VALUES(personUid),
        status = VALUES(status),
        invoiceDetails = VALUES(invoiceDetails),
        xml = VALUES(xml)
    `;
    const orderParams = [
      order.orderUid,
      order.personUid,
      order.status,
      order.invoiceDetails ? JSON.stringify(order.invoiceDetails) : null,
      order.xml || null
    ];
    await connection.query(orderSql, orderParams);

    // Optional: clear old items if re-saving
    const deleteItemsSql = `DELETE FROM items WHERE orderUid = ?`;
    await connection.query(deleteItemsSql, [order.orderUid]);

    // Insert new items
    if (order.itemList && order.itemList.length > 0) {
      const itemSql = `
        INSERT INTO items (
          orderUid, itemId, itemQuantity, itemSeller, itemType, itemPrice, priceDiscount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      for (const item of order.itemList) {
        const itemParams = [
          order.orderUid,
          item.itemId,
          item.itemQuantity,
          item.itemSeller,
          item.itemType ? JSON.stringify(item.itemType) : null,
          item.itemPrice || null,
          item.priceDiscount || null
        ];
        await connection.query(itemSql, itemParams);
      }
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getOrder(orderUid: string): Promise<Order | null> {
  const [orderRows] = await pool.query(`
    SELECT orderUid, personUid, status, invoiceDetails, xml
    FROM orders
    WHERE orderUid = ?
  `, [orderUid]);

  if ((orderRows as any[]).length === 0) {
    return null;
  }
  const row: any = (orderRows as any[])[0];

  // Fetch items
  const [itemRows] = await pool.query(`
    SELECT itemId, itemQuantity, itemSeller, itemType, itemPrice, priceDiscount
    FROM items
    WHERE orderUid = ?
  `, [orderUid]);

  const items: Item[] = (itemRows as any[]).map((r) => {
    return new Item(
      r.itemId,
      r.itemQuantity,
      r.itemSeller,
      r.itemType ? JSON.parse(r.itemType) : undefined,
      r.itemPrice,
      r.priceDiscount
    );
  });

  const order = new Order(
    row.orderUid,
    row.personUid,
    row.status,
    items,
    row.invoiceDetails ? JSON.parse(row.invoiceDetails) : undefined,
    row.xml
  );
  return order;
}

export async function saveSession(session: Session): Promise<void> {
  const sql = `
    INSERT INTO sessions (token, personUid)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      personUid = VALUES(personUid)
  `;
  await pool.query(sql, [session.token, session.personUid]);
}

export async function getSession(token: string): Promise<Session | null> {
  const [rows] = await pool.query(`
    SELECT token, personUid
    FROM sessions
    WHERE token = ?
  `, [token]);
  if ((rows as any[]).length === 0) {
    return null;
  }
  const row: any = (rows as any[])[0];
  return new Session(row.token, row.personUid);
}