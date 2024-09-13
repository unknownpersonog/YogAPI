import { Request, Response, Router } from 'express';
import addVPSRouter from './add';
import assignVPSRouter from './assign';
import deleteVPSRouter from './delete';
import { vps } from '../../database/schemas';

const router = Router();

router.use('/add', addVPSRouter)
router.use('/assign', assignVPSRouter)
router.use('/delete', deleteVPSRouter)
router.get('/info/:vpsId', async (req: Request, res: Response) => {
    try {
      const vpsId = req.params.vpsId;
  
      const vpsX = await vps.findOne({ id: vpsId });
  
      if (!vpsX) {
        return res.status(404).json({ error: 'VPS not found' });
      }

      res.status(200).json(vpsX);
    } catch (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/list', async (req: Request, res: Response) => {
  try {
		const vpsList = await vps.find();
    res.status(200).json(vpsList)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.put('/edit/:vpsId', async (req: Request, res: Response) => {
  try {
    const vpsId = req.params.vpsId;
    const updates = req.body;

    const updatedVPS = await vps.findOneAndUpdate(
      { id: vpsId },
      updates,
      { new: true }
    );

    if (!updatedVPS) {
      return res.status(404).json({ error: 'VPS not found' });
    }
    
    res.status(200).json(updatedVPS)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

export default router;