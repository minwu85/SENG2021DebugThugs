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

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'public', 'swagger.yaml'));

// Serve Swagger UI at the root route (/)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

// Graceful shutdown (not necessary for Vercel, but useful in local environments)
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully.');
  await closeDB();
  process.exit();
});

// Export the Express app as a serverless function
export default app;

// import express, { Application } from 'express';
// import * as swaggerUi from 'swagger-ui-express';
// import * as path from 'path';
// import * as YAML from 'yamljs';

// import personRoutes from './routes/PersonRoutes';
// import orderRoutes from './routes/OrderRoutes';
// import cors from 'cors';
// import { initDB, closeDB} from './database/DatabaseConnection';

// (async () => {
//   try {
//     await initDB();
//     console.log('Database initialized!');
//   } catch (err) {
//     console.error('Error initializing DB:', err);
//   }
// })();

// // Load the swagger YAML file
// const swaggerDocument = YAML.load(path.join(__dirname, 'swagger', 'swagger.yaml'));

// // Optional: If you want to initialize a DB connection, import and call it:
// // import { createDbConnection } from './database/DatabaseConnection';
// // createDbConnection(); // Example usage

// const app: Application = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Swagger docs
// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // Routes
// app.use('/api/person', personRoutes);
// app.use('/api/order', orderRoutes);
// //app.use('/api', adminRoutes);

// // Start the server
// const PORT = process.env.PORT || 3000;
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // For coverage, handle Ctrl+C gracefully
// process.on('SIGINT', async () => {
//   await server.close( async () => {
//     console.log('Shutting down server gracefully.');
//     await closeDB();
//     process.exit();
//   });
// });

// export { server }
// export { PORT };