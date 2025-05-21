import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  alwaysEnabled: { type: Boolean, default: false },
  enabledUsers: [{ type: String }],
});

export const GlobalService = mongoose.model("GlobalService", ServiceSchema);