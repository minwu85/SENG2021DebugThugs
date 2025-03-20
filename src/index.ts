import express, { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as YAML from 'yamljs';
import cors from 'cors';

import personRoutes from './routes/PersonRoutes';
import orderRoutes from './routes/OrderRoutes';
import { initDB, closeDB } from './database/DatabaseConnection';

const app: Application = express();

// Initialize database connection
(async () => {
  try {
    await initDB();
    console.log('Database initialized!');
  } catch (err) {
    console.error('Error initializing DB:', err);
  }
})();

// Serve static files (Swagger UI assets and swagger.yaml)
app.use(express.static(path.join(__dirname, 'public')));

// Load Swagger YAML
const swaggerDocument = YAML.load(path.resolve(__dirname, 'public', 'swagger.yaml'));

// Serve Swagger UI at /api-docs (NO NEED for a separate init file)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// Handle 404 errors (optional)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the Express app
export default app;
