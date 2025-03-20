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

// Serve static files for Swagger UI
app.use('/swagger-ui', express.static(path.join(__dirname, 'public', 'swagger-ui')));

// Serve Swagger YAML file
app.use('/swagger.yaml', express.static(path.join(__dirname, 'public', 'swagger.yaml')));

// Load Swagger document
const swaggerDocument = YAML.load(path.resolve('public', 'swagger.yaml'));

// Setup Swagger UI with custom options
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/swagger.yaml',  // This URL should point to your swagger.yaml
  }
}));

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully.');
  await closeDB();
  process.exit();
});

// Export the Express app as a serverless function
export default app;
