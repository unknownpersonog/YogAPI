import mongoose from "mongoose";

const discordAPISchema = new mongoose.Schema({
    email: { type: String, required: true },
    method: { type: String, required: true },
    admin: { type: String, required: false },
});
  
  export default mongoose.model('discordUsers', discordAPISchema)