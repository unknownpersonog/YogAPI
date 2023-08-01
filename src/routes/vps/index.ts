import { Router } from 'express';
import addVPSRouter from './add';
import assignVPSRouter from './assign';
const router = Router();

router.use('/add', addVPSRouter)
router.use('/assign', assignVPSRouter)

export default router;