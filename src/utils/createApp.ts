import { config } from 'dotenv'; 
import express, { Express } from 'express';
import session from 'express-session';
import routes from '../routes';
import passport from 'passport';
import store from 'connect-mongo';
import { checkAuthorization } from '../services/checkAuthorization';

config();

export function createApp(): Express {
    const app = express();

    // Parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded());
    
    app.use(
        session({
            secret: 'CKDJVBIBVPBVAPFJDJKAHFHYEBFUJIAJAJK',
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 60000 * 60 },
            store: store.create({
                mongoUrl: process.env.MONGODB_DATABASE_URI,
            }),
        })
    );

  // Enable Passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => setTimeout(() => next(), 800));
  
    // Render /api as default
    app.use('/api', checkAuthorization, routes);
    return app;
}