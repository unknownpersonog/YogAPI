import { Router, Request, Response } from "express";
import { GlobalService } from "../../database/schemas/Service";

const router = Router();

// Add a new global service
router.post("/add", async (req: Request, res: Response) => {
  const { key, name, alwaysEnabled = false } = req.body;

  if (!key || !name) {
    return res.status(400).json({ error: "Missing 'key' or 'name'" });
  }

  try {
    const existing = await GlobalService.findOne({ key });
    if (existing) {
      return res.status(400).json({ error: "Service with this key already exists" });
    }

    const newService = new GlobalService({
      key,
      name,
      alwaysEnabled,
      enabledUsers: [] // stores user.email
    });

    await newService.save();
    res.status(201).json({ message: "Service added", service: newService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all services enabled for a specific user (by email)
router.get("/enabled/:email", async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const services = await GlobalService.find(
      {
        $or: [
          { alwaysEnabled: true },
          { enabledUsers: email }
        ]
      },
      {
        enabledUsers: 0 // Exclude enabledUsers field from the result
      }
    );

    res.status(200).json({ data: { services } });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Toggle a service on/off for a user (by email)
router.post("/toggle", async (req: Request, res: Response) => {
  const { email, key, enabled } = req.body;
  
  if (!email || !key) {
    return res.status(400).json({ error: "Missing 'email' or 'service key'" });
  }
  
  try {
    const service = await GlobalService.findOne({ key });
    
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    
    if (service.alwaysEnabled) {
      return res.status(400).json({ error: "Cannot toggle an always-enabled service" });
    }
        
    // Update based on the requested 'enabled' value instead of toggling
    const update = enabled
      ? { $addToSet: { enabledUsers: email } }  // Add the user if not already there
      : { $pull: { enabledUsers: email } };     // Remove the user
      
    await GlobalService.updateOne({ key }, update);
    
    res.status(200).json({ 
      message: `Service ${enabled ? 'enabled' : 'disabled'}`,
      changed: true
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all available services (no user filtering)
router.get("/all", async (req: Request, res: Response) => {
  try {
    const services = await GlobalService.find({}, { enabledUsers: 0 }); // exclude enabledUsers field
    res.status(200).json({ data: { services } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/alladmin", async (req: Request, res: Response) => {
  try {
    const servicesAdmin = await GlobalService.find({});
    res.status(200).json({ data: { servicesAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;