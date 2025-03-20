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

// Define a route for the root
app.get('/', (req, res) => {
  res.send('Welcome to the API! Please visit /swagger for the API documentation.');
});

// Load Swagger docs (ensure this is correct for your file structure)
const swaggerDocument = YAML.load(path.join(__dirname, 'public', 'swagger.yaml'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  // Serving Swagger UI at /swagger

// Middleware
app.use(cors());
app.use(express.json());

// Routes for the API
app.use('/api/person', personRoutes);
app.use('/api/order', orderRoutes);

// Graceful shutdown (useful for local environments)
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