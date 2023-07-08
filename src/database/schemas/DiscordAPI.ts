import mongoose from "mongoose";

const discordAPISchema = new mongoose.Schema({
    email: { type: String, required: true },
    discordId: { type: String, required: true },
    verificationToken: { type: String, required: false },
    verificationTokenExpiresAt: { type: Date, required: false },
    verified: { type: String, required: false, default: 'false' },
    vps: [
        {
          id: { type: String, default: 'N/A' }
        }
      ]
});
  
  export default mongoose.model('discordUsers', discordAPISchema)