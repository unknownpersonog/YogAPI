import { Request, Response, Router } from "express";
import { DiscordAPI } from "../../../database/schemas";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      const method = req.body.method;
      const email = req.body.email;
      if (!method || !email) {
        return res.status(400).json({ error: 'Invalid Request Body!'})
      }

      const existingUser = await DiscordAPI.findOne({ email });
      if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

      const newUser = new DiscordAPI({
        email,
        method
    });
  
      await newUser.save();
  
      res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  export default router;
