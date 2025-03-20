import express, { Application } from 'express';
import * as path from 'path';
import { initDB, closeDB } from './database/DatabaseConnection';
import personRoutes from './routes/PersonRoutes';
import orderRoutes from './routes/OrderRoutes';
import cors from 'cors';

const app: Application = express();

// Initialize database connection once
(async () => {
  try {
    await initDB();
    console.log('Database initialized!');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
})();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve Swagger UI at the root URL ("/")
app.get('/', (req, res) => {
  // Ensure index.html is being properly served
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

// Graceful shutdown (not really needed for Vercel, but useful in local environments)
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully.');
  await closeDB();
  process.exit();
});

// Export the Express app as a serverless function
export default app;
