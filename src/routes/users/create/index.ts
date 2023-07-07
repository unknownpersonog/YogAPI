import express, { Request, Response, Router } from "express";
import { DiscordAPI } from "../../../database/schemas";
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
      const discordId = req.body.discordId;
      const email = req.body.email;
      const vps = req.body.vps;
      if (!discordId || !email) {
        return res.status(400).send('Invalid Request Body!')
      }

      const existingUser = await DiscordAPI.findOne({ discordId });
      if (existingUser) {
      return res.status(409).send('User already exists');
    }

      const newUser = new DiscordAPI({
        email,
        discordId,
        vps: [{ id: 'N/A' }]
    });
  
      await newUser.save();
  
      res.status(200).send('User created successfully');
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  export default router;
