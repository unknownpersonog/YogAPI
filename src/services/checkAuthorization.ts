import { NextFunction, Request, Response } from "express";

// Define a middleware to check for authorization and admin status
async function checkAuthorization(req: Request, res: Response, next: NextFunction) {
    try {
        // Check if the token exists in the database
        const token = req.headers['x-access-token'];

        if (!token) {
            // Token is missing, return a 403 Forbidden response
            return res.status(403).json({ message: 'Authorization required' });
        }

        const foundToken = process.env.ADMIN_TOKEN

        if (!foundToken) {
            // Token does not exist in the database, return a 403 Forbidden response
            return res.status(403).json({ message: 'Authorization required' });
        }

        if (token === foundToken) {
            next();
        }
        else {
            res.status(403).send('Authorized Access Only')
        }
    } catch (error) {
        console.error('Error checking authorization:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export { checkAuthorization };
