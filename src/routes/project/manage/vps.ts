import { Router, Request, Response } from 'express';
import { Project, vps } from '../../../database/schemas'; // Adjust path as needed

const router = Router();

// Assign a VPS to a project
router.post('/assign', async (req: Request, res: Response) => {
    try {
        const { projectId, vpsId } = req.body;

        // Validate input
        if (!projectId || !vpsId) {
            return res.status(400).json({ error: 'Project ID and VPS ID are required' });
        }

        // Find the project
        const project = await Project.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the VPS
        const vpsInstance = await vps.findOne({ id: vpsId });
        if (!vpsInstance) {
            return res.status(404).json({ error: 'VPS not found' });
        }

        // Assign VPS to project by ID
        if (!project.vps.includes(vpsId)) {
            project.vps.push(vpsId);
            await project.save();
        }

        res.status(200).json({ message: 'VPS assigned to project successfully' });
    } catch (err) {
        console.error('Error assigning VPS to project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove a VPS from a project
router.post('/remove', async (req: Request, res: Response) => {
    try {
        const { projectId, vpsId } = req.body;

        // Validate input
        if (!projectId || !vpsId) {
            return res.status(400).json({ error: 'Project ID and VPS ID are required' });
        }

        // Find the project
        const project = await Project.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Remove VPS from project by ID
        project.vps = project.vps.filter(vps => vps !== vpsId);
        await project.save();

        res.status(200).json({ message: 'VPS removed from project successfully' });
    } catch (err) {
        console.error('Error removing VPS from project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
