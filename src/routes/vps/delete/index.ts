import { Request, Response, Router } from "express";
import { vps } from "../../../database/schemas";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const vpsId = req.body.vpsId;
        if (!vpsId) {
            return res.status(400).json({ error: 'Invalid Request Body: vpsId is required' });
        }

        const existingVPS = await vps.findOne({ vpsId });
        if (!existingVPS) {
            return res.status(404).json({ error: 'VPS not found' });
        }

        await vps.findOneAndDelete({ vpsId });

        res.status(200).json({ message: 'VPS deleted successfully' });
    } catch (err) {
        console.error('Error deleting vps:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;