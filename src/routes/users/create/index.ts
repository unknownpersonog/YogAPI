import { Request, Response, Router } from "express";
import { DiscordAPI } from "../../../database/schemas";
import crypto from "crypto";

const router = Router();

function generateUNID(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

router.post('/', async (req: Request, res: Response) => {
    try {
        const { method, email } = req.body;
        if (!method || !email) {
            return res.status(400).json({ error: 'Invalid Request Body!' });
        }

        const existingUser = await DiscordAPI.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        let unid = generateUNID();
        while (await DiscordAPI.findOne({ unid })) {
            unid = generateUNID();
        }

        const newUser = new DiscordAPI({
            email,
            method,
            joinDate: new Date(),
            unid
        });

        await newUser.save();

        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                email: newUser.email,
                unid: newUser.unid,
                joinDate: newUser.joinDate
            }
        });
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;