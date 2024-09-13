import { Request, Router, Response } from "express";
const router = Router();
import user from './user'
import vps from './vps'

router.use('/user', user);
router.use('/vps', vps);
export default router;