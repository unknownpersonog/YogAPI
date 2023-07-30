import { Request, Response, Router } from 'express';
import { vps } from '../../../database/schemas';

const router = Router();
interface RequestData {
    req: Request;
    res: Response;
  }
  
  const requestQueue: RequestData[] = []; // Specify the type of the requestQueue array
    
  router.post('/', async (req: Request, res: Response) => {
    try {
      const requestData: RequestData = {
        req,
        res,
      };
      requestQueue.push(requestData);
  
      if (requestQueue.length === 1) {
        // Process the request immediately if it's the only one in the queue
        await processRequest(requestData);
      } else {
        // The request is added to the queue, and it will be processed later
        await waitForRequestCompletion(requestData);
      }
    } catch (err) {
      console.error('Error processing request:', err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  async function processRequest(requestData: RequestData) {
    try {
      const vpsPort = await getLastId() + 5001;
      const vpsName = requestData.req.body.vps_name;
      const vpsOs = requestData.req.body.vps_os;
      const vpsId = await getLastId() + 1;
  
      if (!vpsName || !vpsOs) {
        return requestData.res.status(400).send('Invalid Request Body!');
      }
  
      const existingVPS = await vps.findOne({ vpsId });
      if (existingVPS) {
        return requestData.res.status(409).send('VPS already exists');
      }
  
      const newVPS = new vps({
        port: vpsPort,
        name: vpsName,
        os: vpsOs,
        id: vpsId,
      });
  
      await newVPS.save();
  
      requestData.res.status(200).send('VPS created successfully');
    } catch (err) {
      console.error('Error creating vps:', err);
      requestData.res.status(500).send('Internal Server Error');
    } finally {
      // After processing the request, remove it from the queue
      const index = requestQueue.indexOf(requestData);
      if (index !== -1) {
        requestQueue.splice(index, 1);
      }
  
      // If there are other requests in the queue, process the next one
      if (requestQueue.length > 0) {
        const nextRequest = requestQueue[0];
        await processRequest(nextRequest);
      }
    }
  }
  
  function waitForRequestCompletion(requestData: RequestData) {
    return new Promise<void>((resolve) => {
      const checkQueue = () => {
        if (requestData === requestQueue[0]) {
          // If this request is the first in the queue, start processing it
          processRequest(requestData).then(() => resolve());
        } else {
          // If this request is not first in the queue, wait and check again
          setTimeout(checkQueue, 100);
        }
      };
      checkQueue();
    });
  }


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