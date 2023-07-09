"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const discordAPISchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('discordUsers', discordAPISchema);
