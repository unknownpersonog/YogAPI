import { Router, Request, Response } from 'express';
import { Project } from '../../../database/schemas';
import { DiscordAPI } from '../../../database/schemas'; // Import User model

const router = Router();

// Function to generate a unique 6-digit ID
async function generateUniqueId(): Promise<string> {
    let uniqueId = ''; // Initialize with a default value
    let isUnique = false;

    while (!isUnique) {
        uniqueId = Math.floor(100000 + Math.random() * 900000).toString();

        // Check if the generated ID already exists
        const existingProject = await Project.findOne({ uniqueId });
        if (!existingProject) {
            isUnique = true;
        }
    }

    return uniqueId;
}

// Create a project
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, email } = req.body;

        // Find user by email
        const user = await DiscordAPI.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const uniqueId = await generateUniqueId(); // Ensure unique ID
        const project = new Project({ uniqueId, name, description, users: [user.unid] }); // Add user ObjectId to users array

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
