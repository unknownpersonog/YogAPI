import { NextFunction, Request, Response, Router } from 'express';
import responseTime from 'response-time';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);

router.use('/ping', responseTime())

router.get('/ping', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const responseObj = {
        message: 'Pong!',
      };
  
      res.json(responseObj);
    } catch (err) {
      res.status(501).send('Internal Server Error');
    }
  });

export default router;