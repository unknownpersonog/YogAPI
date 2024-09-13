import { Router, Request, Response } from 'express';
import { Project } from '../../../database/schemas';

const router = Router();

// Delete a project
router.post('/', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        const deletedProject = await Project.findOneAndDelete({ projectId });
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
