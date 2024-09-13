import { Request, Response, Router } from "express";
import { DiscordAPI } from "../../../database/schemas";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({ error: 'Invalid Request Body: email is required' });
        }

        const existingUser = await DiscordAPI.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await DiscordAPI.findOneAndDelete({ email });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;