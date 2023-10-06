import { Request, Response, Router } from 'express';
import { DiscordAPI, vps } from '../../../database/schemas';
// @ts-ignore
import queue from 'express-queue';
const router = Router();

router.use('/', queue({ activeLimit: 1, queuedLimit: -1 }))    
router.post('/', async(req: Request, res: Response) => {
    const discordId = req.body.discordId;
    const plan = req.body.plan;
    const availableVPSId = await assignNextAvailableVPS(plan); 

    if (availableVPSId === 0) {
      return res.status(500).json({ error: 'No VPS in stock' })
    }

    try {
        await vps.findOneAndUpdate(
            { id: availableVPSId, owner: 'N/A' },
            { $set: { owner: discordId } },
            { new: true } // Return the updated VPS document.
          );
          try {
              await DiscordAPI.findOneAndUpdate(
                { discordId: discordId },
                { $push: { "vps": { id: availableVPSId } } },
                { new: true }
              );            
          }
          catch (err) {
              console.log(err)
              return res.status(500).json({ error: 'Error while updating user data' })
          }
          res.status(200).json({ messsage: `VPS ${availableVPSId} assigned to Discord user ${discordId}` });
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

async function assignNextAvailableVPS(plan: string) {
  try {
    // Find the first available VPS with owner tag "N/A" by sorting the VPS collection in ascending order of the ID.
    const firstAvailableVPS = await vps
      .findOne({ owner: 'N/A', plan: plan })
      .sort({ id: 1 })
      .select({ id: 1, _id: 0 })
      
    if (!firstAvailableVPS) {
      return 0;
    }

    // If the first available VPS has the owner tag "N/A," return it as the next available VPS.
    return firstAvailableVPS.id.toString();;
  } catch (err) {
    return console.error('Error assigning VPS:', err);
  }
}

export default router;