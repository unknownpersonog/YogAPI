import { Request, Response, Router } from 'express';
import { DiscordAPI, vps } from '../../../database/schemas';
// @ts-ignore
import queue from 'express-queue';
const router = Router();

router.use('/', queue({ activeLimit: 1, queuedLimit: -1 }))    
router.post('/', async(req: Request, res: Response) => {
    const discordId = req.body.discordId;
    const plan = req.body.plan;
    const availableVPSId = await assignNextAvailableVPS();

    if (availableVPSId === 0) {
      return res.status(500).send('No VPS in stock')
    }

    try {
        await vps.findOneAndUpdate(
            { id: availableVPSId, owner: 'N/A' },
            { $set: { owner: discordId } },
            { new: true } // Return the updated VPS document.
          );
          try {
              await DiscordAPI.findOneAndUpdate(
                { discordId: discordId, 'vps.id': 'N/A' },
                { $set: { "vps.$.id": availableVPSId } },
                { new: true }
              )
          }
          catch (err) {
              return res.status(500).send('Error while updating user data')
          }
          res.status(200).send(`VPS ${availableVPSId} assigned to Discord user ${discordId}`);
    }
    catch (err) {
        return res.status(500).send('Internal Server Error')
    }
})

async function assignNextAvailableVPS() {
  try {
    // Find the first available VPS with owner tag "N/A" by sorting the VPS collection in ascending order of the ID.
    const firstAvailableVPS = await vps
      .findOne({ owner: 'N/A' })
      .sort({ id: 1 })
      .select({ id: 1, _id: 0 })
      
    if (!firstAvailableVPS) {
      return 0;
    }

    // If the first available VPS has the owner tag "N/A," return it as the next available VPS.
    return firstAvailableVPS.id.toString();;
  } catch (err) {
    console.error('Error assigning VPS:', err);
    throw err; // You can handle the error appropriately based on your use case.
  }
}

export default router;