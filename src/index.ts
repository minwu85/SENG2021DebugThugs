import express, { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as fs from 'fs';
import cors from 'cors';

import personRoutes from './routes/PersonRoutes';
import orderRoutes from './routes/OrderRoutes';
import { initDB, closeDB } from './database/DatabaseConnection';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

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
//app.use(express.static(path.join(process.cwd(), 'public')));

// API routes
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

if (fs.existsSync(path.join(process.cwd(), 'public', 'swagger.yaml'))) {
  console.log('swagger.yaml exists at the resolved path.');
} else {
  console.error('swagger.yaml does NOT exist at the resolved path.');
}
// Load Swagger YAML
const swaggerDocument = YAML.load(path.join(process.cwd(), 'public', 'swagger.yaml'));
// CDN CSS
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss:
    '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL,
}));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully.');
  await closeDB();
  process.exit();
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the Express app
export default app;
