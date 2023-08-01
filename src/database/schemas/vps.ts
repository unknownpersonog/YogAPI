import mongoose from "mongoose";

const vpsSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    os: { type: String, required: true },
    port: { type: Number, required: true, unique: true },
    owner: { type: String, default: "N/A", required: false },
});
  
  export default mongoose.model('vpsdata', vpsSchema)