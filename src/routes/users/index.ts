import { Request, Router, Response } from "express";
const router = Router();
import createUserRouter from './create';
import verifyEmailRouter from './verify';
import { DiscordAPI } from "../../database/schemas";

router.use('/create', createUserRouter)
router.use('/verify', verifyEmailRouter)

router.get('/info/:discordId', async (req: Request, res: Response) => {
  try {
    const discordId = req.params.discordId;

    const user = await DiscordAPI.findOne({ discordId });

    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    res.json(user);
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;