import mongoose from "mongoose";

const discordAPISchema = new mongoose.Schema({
    email: { type: String, required: true },
    method: { type: String, required: true },
    admin: { type: String, required: false },
    coins: { type: Number, required: false },
    joinDate: { type: Date, required: true },
    unid: { type: String, required: true },
    vpsIds: [{ type: Number }], // Array of VPS IDs
});
  
  export default mongoose.model('discordUsers', discordAPISchema)