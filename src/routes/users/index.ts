import { Request, Router, Response } from "express";
const router = Router();
import createUserRouter from './create';
import { DiscordAPI } from "../../database/schemas";

router.use('/create', createUserRouter)

router.get('/:discordId', async (req: Request, res: Response) => {
  try {
    const discordId = req.params.discordId;

    const user = await DiscordAPI.findOne({ discordId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (err) {
    console.error('Error retrieving user:', err);
    res.status(500).send('Internal Server Error');
  }
});


export default router;