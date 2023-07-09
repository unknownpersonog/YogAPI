"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("../routes"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
(0, dotenv_1.config)();
function createApp() {
    const app = (0, express_1.default)();
    // Parsing Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded());
    // Using CORS to block external requests
    app.use((0, cors_1.default)({ origin: ['http://0.0.0.0'], credentials: true }));
    app.use((0, express_session_1.default)({
        secret: 'CKDJVBIBVPBVAPFJDJKAHFHYEBFUJIAJAJK',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 60 },
        store: connect_mongo_1.default.create({
            mongoUrl: process.env.MONGODB_DATABASE_URI,
        }),
    }));
    // Passport basic setup
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    // Render /api as default
    app.use('/api', routes_1.default);
    return app;
}
exports.createApp = createApp;
