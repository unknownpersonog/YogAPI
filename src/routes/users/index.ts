import { Request, Router, Response } from "express";
const router = Router();
import createUserRouter from './create';

import { DiscordAPI } from "../../database/schemas";

router.use('/create', createUserRouter)


router.get('/info/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    const user = await DiscordAPI.findOne({ email });

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