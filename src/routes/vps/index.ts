import { Request, Response, Router } from 'express';
import addVPSRouter from './add';
import assignVPSRouter from './assign';
import { vps } from '../../database/schemas';

const router = Router();

router.use('/add', addVPSRouter)
router.use('/assign', assignVPSRouter)
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

export default router;