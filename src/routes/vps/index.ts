import { Router } from 'express';
import addVPSRouter from './add'
const router = Router();

router.use('/add', addVPSRouter)

export default router;