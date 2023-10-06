import mongoose from "mongoose";

const vpsSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    os: { type: String, required: true },
    port: { type: Number, required: true, unique: true },
    owner: { type: String, default: "N/A", required: false },
    pass: { type: String, required: true },
    plan: { type: String, required: true },
    user: { type: String, required: true },
    ip: { type: String, required: true },
});
  
  export default mongoose.model('vpsdata', vpsSchema)