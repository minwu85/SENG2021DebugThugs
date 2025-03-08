import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';

import personRoutes from './routes/PersonRoutes';
import orderRoutes from './routes/OrderRoutes';

// Load the swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger', 'swagger.yaml'));

// Optional: If you want to initialize a DB connection, import and call it:
// import { createDbConnection } from './database/DatabaseConnection';
// createDbConnection(); // Example usage

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
