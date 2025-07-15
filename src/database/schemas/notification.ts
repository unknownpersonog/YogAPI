import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  message: { type: String, required: true },
  level: { type: Number, required: true }, // 1=low, 2=medium, 3=high
  createdAt: { type: Date, default: Date.now },
  otn: { type: Boolean, default: false },
  expiresAt: { type: Date }, // Only for OTN
  title: { type: String, required: false },
});

export default mongoose.model("Notification", notificationSchema);