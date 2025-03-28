import app from './index';
import { initDB, closeDB } from './database/DatabaseConnection';
import { Server } from 'http';

const PORT = process.env.PORT || 5001; // Use test port

let server: Server | null = null;

export async function startServer(): Promise<Server> {
  await initDB();
  return new Promise((resolve, reject) => {
    try {
      server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        resolve(server!);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}


export async function stopServer(): Promise<void> {
  if (server) {
    await closeDB();
    server.close();
    console.log('Server stopped.');
  }
}
