import { Request, Response, Router } from 'express';
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);

router.use('/ping', (res: Response) => {
    try {
        res.status(200).send('Pong!');
    }
    catch (err) {
        res.status(501).send('Internal Server Error')
    }
});
export default router;