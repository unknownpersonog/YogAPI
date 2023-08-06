import { Request, Response, Router } from 'express';
import { vps } from '../../../database/schemas';
// @ts-ignore
import queue from 'express-queue';

const router = Router();
router.use('/', queue({ activeLimit: 1, queuedLimit: -1 }))    
router.post('/', async (req: Request, res: Response) => {
    try {
      const vpsPort = await getLastId() + 5001;
      const vpsName = req.body.vps_name;
      const vpsOs = req.body.vps_os;
      const vpsPass = req.body.vps_pass;
      const vpsUser = req.body.vps_user;
      const vpsIp = req.body.vps_ip
      const vpsId = await getLastId() + 1;
  
      if (!vpsName || !vpsOs) {
        return res.status(400).send('Invalid Request Body!');
      }
  
      const existingVPS = await vps.findOne({ vpsId });
      if (existingVPS) {
        return res.status(409).send('VPS already exists');
      }
  
      const newVPS = new vps({
        port: vpsPort,
        name: vpsName,
        os: vpsOs,
        id: vpsId,
        pass: vpsPass,
        user: vpsUser,
        ip: vpsIp
      });
  
      await newVPS.save();
  
      res.status(200).send('VPS created successfully');
    } catch (err) {
      console.error('Error creating vps:', err);
      res.status(500).send('Internal Server Error');
    }
});


async function getLastId() {
    let lastId = 0;
  
    try {
      const existingVpsData = await vps.findOne({}, {}, { sort: { id: -1 } });
      if (existingVpsData) {
        lastId = existingVpsData.id;
      }
    } catch (err) {
      console.error("Error while fetching lastId:", err);
    }
  
    return lastId;
  }

export default router;