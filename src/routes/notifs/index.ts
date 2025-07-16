import { Router, Request, Response } from "express";
import Notification from "../../database/schemas/notification";
import { DiscordAPI } from "../../database/schemas";

const router = Router();

// Helper to get next sequential notification ID
async function getNextNotificationId() {
  const last = await Notification.findOne({}, {}, { sort: { id: -1 } });
  return last ? last.id + 1 : 1;
}

// Create a notification
router.post("/create", async (req: Request, res: Response) => {
  const { message, level, title } = req.body;
  if (!message || !level) {
    return res.status(400).json({ error: "Missing message or level" });
  }
  const id = await getNextNotificationId();
  const notif = new Notification({ id, message, level, title });
  await notif.save();
  res.status(201).json({ message: "Notification created", notif });
});

// Create an OTN (One-Time Notification)
router.post("/create-otn", async (req: Request, res: Response) => {
  const { message, level, title } = req.body;
  if (!message || !level) {
    return res.status(400).json({ error: "Missing message or level" });
  }
  const id = await getNextNotificationId();
  const expiresAt = (level === 3) ? undefined : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const notif = new Notification({ id, message, level, otn: true, expiresAt, title });
  await notif.save();
  res.status(201).json({ message: "OTN Notification created", notif });
});

// Assign notification to user(s)
router.post("/assign", async (req: Request, res: Response) => {
  const { notificationId, emails } = req.body;
  if (!notificationId || !emails || !Array.isArray(emails)) {
    return res.status(400).json({ error: "Missing notificationId or emails" });
  }
  await DiscordAPI.updateMany(
    { email: { $in: emails } },
    { $addToSet: { unread: notificationId } }
  );
  res.status(200).json({ message: "Notification assigned" });
});

// Assign notification to all users
router.post("/assign-all", async (req: Request, res: Response) => {
  const { notificationId } = req.body;
  if (!notificationId) {
    return res.status(400).json({ error: "Missing notificationId" });
  }
  await DiscordAPI.updateMany(
    {},
    { $addToSet: { unread: notificationId } }
  );
  res.status(200).json({ message: "Notification assigned to all users" });
});

// Mark notification as read
router.post("/mark-read/:email", async (req: Request, res: Response) => {
  const { notificationId } = req.body;
  const email = req.params.email;
  if (!email || !notificationId) {
    return res.status(400).json({ error: "Missing email or notificationId" });
  }
  await DiscordAPI.updateOne(
    { email },
    { $pull: { unread: notificationId } }
  );
  // Check if notification is OTN and delete if so (regardless of level)
  const notif = await Notification.findOne({ id: notificationId });
  if (notif?.otn) {
    await Notification.deleteOne({ id: notificationId });
  }
  res.status(200).json({ message: "Notification marked as read" });
});

// Mark all non-OTN, non-level-3 notifications as read for a user
router.get("/mark-all-read/:email", async (req: Request, res: Response) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  const user = await DiscordAPI.findOne({ email });
  if (!user || !user.unread || user.unread.length === 0) {
    return res.status(200).json({ message: "No unread notifications" });
  }

  // Find all non-level-3 notification IDs in user's unread
  const notifs = await Notification.find({ id: { $in: user.unread }});
  const toRemove = notifs.filter(n => n.level !== 3).map(n => n.id);

  await DiscordAPI.updateOne(
    { email },
    { $pull: { unread: { $in: toRemove } } }
  );

  res.status(200).json({ message: "All non-critical, notifications marked as read" });
});

// Get unread notifications for a user
router.get("/unread/:email", async (req: Request, res: Response) => {
  const user = await DiscordAPI.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ error: "User not found" });
  const notifs = await Notification.find({ id: { $in: user.unread || [] } });
  res.status(200).json({ notifications: notifs });
});

// Flush expired OTN notifications (non-level-3)
router.get("/flush-otn", async (req: Request, res: Response) => {
  try {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      otn: true,
      level: { $ne: 3 },
      expiresAt: { $lte: cutoff },
    });

    res.status(200).json({
      message: "Expired OTN notifications flushed",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error flushing OTN notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all non-OTN notifications (for admins)
router.get("/non-otn", async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ otn: { $ne: true } }).sort({ id: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching non-OTN notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/delete", async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing notification ID" });

  await Notification.deleteOne({ id: Number(id) });
  res.status(200).json({ success: true });
});

export default router;