import { NextFunction, Request, Response, Router } from 'express';
import responseTime from 'response-time';
import usersRouter from './users';
import vpsRouter from './vps';
const router = Router();

router.use('/users', usersRouter);
router.use('/vps', vpsRouter);
router.use('/ping', responseTime());

router.get('/ping', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const responseObj = {
        message: 'Pong!',
      };
  
      res.json(responseObj);
    } catch (err) {
      res.status(501).json({ error: 'Internal Server Error'});
    }
  });

export default router;