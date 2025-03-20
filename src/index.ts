import express, { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as YAML from 'yamljs';
import cors from 'cors';

import personRoutes from './routes/PersonRoutes';
import orderRoutes from './routes/OrderRoutes';
import { initDB, closeDB } from './database/DatabaseConnection';

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

// Correct path to swagger.yaml in 'public' folder
const swaggerDocument = YAML.load(path.resolve('public', 'swagger.yaml'));

// Serve Swagger UI at the root URL ("/")
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
