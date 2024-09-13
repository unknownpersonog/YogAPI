import { Request, Router, Response } from "express";
const router = Router();
import createUserRouter from './create';
import deleteUserRouter from './delete'
import { DiscordAPI } from "../../database/schemas";

router.use('/create', createUserRouter)
router.use('/delete', deleteUserRouter)
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

router.get('/list', async (req: Request, res: Response) => {
  try {
		const users = await DiscordAPI.find();
    res.status(200).json(users)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.put('/edit/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const updates = req.body;
    
    const updatedUser = await DiscordAPI.findOneAndUpdate(
      { email: email },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser)
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default router;