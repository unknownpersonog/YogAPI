import { config } from 'dotenv'; 
import express, { Express } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import routes from '../routes';
config();

require('../strategies/discord')

export function createApp(): Express {
    const app = express();

    // Parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded());
    
    // Using CORS to block external requests
    app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

    app.use(
        session({
            secret: 'CKDJVBIBVPBVAPFJDJKAHFHYEBFUJIAJAJK',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 60000 * 60 },
        })
    );
    
    // Passport basic setup
    app.use(passport.initialize());
    app.use(passport.session());

    // Render /api as default
    app.use('/api', routes);
    return app;
}