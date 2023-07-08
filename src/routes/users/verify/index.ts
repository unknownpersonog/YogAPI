import { config } from 'dotenv'
import { Request, Response, Router } from "express";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { DiscordAPI } from "../../../database/schemas";
config();

const router = Router();

router.post('/mail', async(req: Request, res: Response) => {
  const discordId = req.body.discordId;
  const email = req.body.email;
  const userCheck = await DiscordAPI.findOne({ discordId });
  if (!userCheck) {
    return res.status(404).send('User not found')
  }
  await DiscordAPI.findOneAndUpdate(
    { discordId },
    { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } }
  );
  
  const { verificationToken, expiresAt } = generateVerificationToken();

  try {
    await DiscordAPI.findOneAndUpdate(
      { discordId },
      { verificationToken, verificationTokenExpiresAt: expiresAt }
    );

    const transporter = nodemailer.createTransport({
      host: String(process.env.SMTP_HOST),
      port: Number(process.env.SMTP_PORT),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: String(process.env.SMTP_USER),
        pass: String(process.env.SMTP_PASS),
      },
    });

    const mailOptions = {
      from: `${process.env.COMPANY_NAME} <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: 
             ${process.env.DOMAIN}/api/users/verify/token?token=${verificationToken}&discordId=${discordId}`,
      html: `<p>Please click the following link to verify your email:</p>
             <p><a href="${process.env.DOMAIN}/api/users/verify/token?token=${verificationToken}&discordId=${discordId}">Verify Email</a></p>`,
    };

    transporter.sendMail(mailOptions);
    res.status(200).send('Email Sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'An error occurred while sending the verification email.' });
  }
});

router.get('/token', async(req: Request, res: Response) => {
  const token = req.query.token;
  const discordId = req.query.discordId;

  if (!token || !discordId) {
    return res.status(404).send('Invalid Request');
  }

  try {
    const user = await DiscordAPI.findOne({ discordId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const expiresAt = user.verificationTokenExpiresAt;

    if (!expiresAt || new Date() > expiresAt) {
      return res.status(400).send('Token Expired');
    }


    if (user.verified === 'true') {
      return res.status(400).send('User already verified');
    }

    if (user.verificationToken === token) {
      await DiscordAPI.findOneAndUpdate(
        { discordId },
        { verified: true }
      );
      await DiscordAPI.findOneAndUpdate(
        { discordId },
        { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } }
      );

      return res.status(200).send('Verified');
    } else {
      return res.status(404).send('Invalid Token');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'An error occurred while verifying the token.' });
  }
});

function generateVerificationToken() {
  const buffer = crypto.randomBytes(32);
  const verificationToken = buffer.toString('hex');
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 60); // Expiration time is set to 60 minutes from now
  return { verificationToken, expiresAt };
}

export default router;
