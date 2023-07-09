"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const schemas_1 = require("../../../database/schemas");
(0, dotenv_1.config)();
const router = (0, express_1.Router)();
router.post('/mail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const discordId = req.body.discordId;
    const email = req.body.email;
    const userCheck = yield schemas_1.DiscordAPI.findOne({ discordId });
    if (!userCheck) {
        return res.status(404).send('User not found');
    }
    yield schemas_1.DiscordAPI.findOneAndUpdate({ discordId }, { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } });
    const { verificationToken, expiresAt } = generateVerificationToken();
    try {
        yield schemas_1.DiscordAPI.findOneAndUpdate({ discordId }, { verificationToken, verificationTokenExpiresAt: expiresAt });
        const transporter = nodemailer_1.default.createTransport({
            host: String(process.env.SMTP_HOST),
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: String(process.env.SMTP_USER),
                pass: String(process.env.SMTP_PASS),
            },
        });
        const mailOptions = {
            from: `${process.env.COMPANY_NAME} <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: 'Email Verification',
            text: `Your code for verification is: 
             ${verificationToken}`,
            html: `<p>Your code for verification is:</p>
             <p><h1>${verificationToken}</h1></p>`,
        };
        transporter.sendMail(mailOptions);
        res.status(200).send('Email Sent');
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'An error occurred while sending the verification email.' });
    }
}));
router.post('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const discordId = req.body.discordId;
    if (!token || !discordId) {
        return res.status(404).send('Invalid Request');
    }
    try {
        const user = yield schemas_1.DiscordAPI.findOne({ discordId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const expiresAt = user.verificationTokenExpiresAt;
        if (!expiresAt || new Date() > expiresAt) {
            yield schemas_1.DiscordAPI.findOneAndUpdate({ discordId }, { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } });
            return res.status(400).send('Token Expired');
        }
        if (user.verified === 'true') {
            return res.status(400).send('User already verified');
        }
        if (user.verificationToken === token) {
            yield schemas_1.DiscordAPI.findOneAndUpdate({ discordId }, { verified: true });
            yield schemas_1.DiscordAPI.findOneAndUpdate({ discordId }, { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } });
            return res.status(200).send('Verified');
        }
        else {
            return res.status(404).send('Invalid Token');
        }
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'An error occurred while verifying the token.' });
    }
}));
function generateVerificationToken() {
    const verificationToken = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 60); // Expiration time is set to 60 minutes from now
    return { verificationToken, expiresAt };
}
exports.default = router;
