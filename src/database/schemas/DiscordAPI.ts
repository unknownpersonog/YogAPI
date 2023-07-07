import mongoose from "mongoose";

const discordAPISchema = new mongoose.Schema({
    email: { type: String, required: true },
    discordId: { type: String, required: true },
    vps: [
        {
          id: { type: String, default: 'N/A' }
        }
      ]
});
  
  export default mongoose.model('discordUsers', discordAPISchema)