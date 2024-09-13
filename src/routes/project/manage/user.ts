import { Router, Request, Response } from 'express';
import { Project, DiscordAPI } from '../../../database/schemas'; // Adjust path as needed

const router = Router();

// Assign a user to a project
router.post('/assign', async (req: Request, res: Response) => {
    try {
        const { projectId, email } = req.body;

        // Find the project
        const project = await Project.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the user
        const user = await DiscordAPI.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Assign user to project by email
        if (!project.users.includes(email)) {
            project.users.push(email);
            await project.save();
        }

        res.status(200).json({ message: 'User assigned to project successfully' });
    } catch (err) {
        console.error('Error assigning user to project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove a user from a project
router.post('/remove', async (req: Request, res: Response) => {
    try {
        const { projectId, userEmail } = req.body;

        // Find the project
        const project = await Project.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Remove user from project by email
        project.users = project.users.filter(email => email !== userEmail);
        await project.save();

        res.status(200).json({ message: 'User removed from project successfully' });
    } catch (err) {
        console.error('Error removing user from project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
