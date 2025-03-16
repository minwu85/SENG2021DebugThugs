import mysql from 'mysql2/promise';


export const pool = mysql.createPool({
  host: 'debug-thugs-db.c568c4wg0fr2.ap-southeast-2.rds.amazonaws.com',
  user: 'debugthugs',
  password: 'DebugThugs2021',
  database: 'debugthugsdb',
  port: 3306,
  // optional config
  connectionLimit: 10,
  waitForConnections: true,
});

export async function initDB(): Promise<void> {
  // You can run your CREATE TABLE statements here or keep them in a migration script
  const createPersons = `
    CREATE TABLE IF NOT EXISTS persons (
      personUid VARCHAR(36) PRIMARY KEY,
      username  VARCHAR(100) NOT NULL,
      password  VARCHAR(100) NOT NULL,
      email     VARCHAR(100) NOT NULL
    )`;
  const createOrders = `
    CREATE TABLE IF NOT EXISTS orders (
      orderUid       VARCHAR(36) PRIMARY KEY,
      personUid      VARCHAR(36) NOT NULL,
      status         ENUM('Pending', 'Completed', 'Deleted') NOT NULL,
      invoiceDetails JSON NULL,
      xml            TEXT NULL,
      FOREIGN KEY (personUid) REFERENCES persons(personUid)
    )`;
  const createItems = `
    CREATE TABLE IF NOT EXISTS items (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      orderUid       VARCHAR(36) NOT NULL,
      itemId         VARCHAR(36) NOT NULL,
      itemQuantity   INT NOT NULL,
      itemSeller     VARCHAR(36) NOT NULL,
      itemType       JSON NULL,
      itemPrice      DECIMAL(10, 2) NULL,
      priceDiscount  DECIMAL(10, 2) NULL,
      FOREIGN KEY (orderUid) REFERENCES orders(orderUid)
    )`;
  const createSessions = `
    CREATE TABLE IF NOT EXISTS sessions (
      token     VARCHAR(100) PRIMARY KEY,
      personUid VARCHAR(36) NOT NULL,
      FOREIGN KEY (personUid) REFERENCES persons(personUid)
    )`;

  await pool.query(createPersons);
  await pool.query(createOrders);
  await pool.query(createItems);
  await pool.query(createSessions);
}