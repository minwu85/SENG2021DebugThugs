"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const path = __importStar(require("path"));
const YAML = __importStar(require("yamljs"));
const PersonRoutes_1 = __importDefault(require("./routes/PersonRoutes"));
const OrderRoutes_1 = __importDefault(require("./routes/OrderRoutes"));
const cors_1 = __importDefault(require("cors"));
const DatabaseConnection_1 = require("./database/DatabaseConnection");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DatabaseConnection_1.initDB)();
        console.log('Database initialized!');
    }
    catch (err) {
        console.error('Error initializing DB:', err);
    }
}))();
// Load the swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger', 'swagger.yaml'));
// Optional: If you want to initialize a DB connection, import and call it:
// import { createDbConnection } from './database/DatabaseConnection';
// createDbConnection(); // Example usage
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Routes
app.use('/api/person', PersonRoutes_1.default);
app.use('/api/order', OrderRoutes_1.default);
//app.use('/api', adminRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.server = server;
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Shutting down server gracefully.');
        process.exit();
    });
});
