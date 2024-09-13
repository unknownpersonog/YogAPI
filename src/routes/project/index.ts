import { Request, Router, Response } from "express";
import { Project } from '../../database/schemas';

const router = Router();

import createProjectRouter from './create'
import deleteProjectRouter from './delete'
import manageProjectRouter from './manage'

router.use('/create', createProjectRouter)
router.use('/delete', deleteProjectRouter)
router.use('/manage', manageProjectRouter)

router.get('/list', async (req: Request, res: Response) => {
    try {
          const projectList = await Project.find();
      res.status(200).json(projectList)
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;