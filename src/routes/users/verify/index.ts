import { config } from 'dotenv'
import { Request, Response, Router } from "express";
import nodemailer from 'nodemailer';
import { DiscordAPI } from "../../../database/schemas";
import { settingsParser } from '../../../services/settingsParser';
config();

const router = Router();

router.post('/mail', async(req: Request, res: Response) => {
  const discordId = req.body.discordId;
  const email = req.body.email;
  const userCheck = await DiscordAPI.findOne({ discordId });
  if (!userCheck) {
    return res.status(404).json({ error: 'User not found' })
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
    
    const settings = settingsParser();
    const transporter = nodemailer.createTransport({
      host: String(settings.smtp.host),
      port: Number(settings.smtp.port),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: String(settings.smtp.user),
        pass: String(settings.smtp.pass),
      },
    });

    const mailOptions = {
      from: `${settings.companyName} <${settings.smtp.mail}>`,
      to: email,
      subject: 'Email Verification',
      text: `Your code for verification is: 
             ${verificationToken}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your login</title>
  <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>

<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation" data-darkreader-inline-border-top="" data-darkreader-inline-border-right="" data-darkreader-inline-border-bottom=""
    data-darkreader-inline-border-left=""
    style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial; background-color: rgb(239, 239, 239); --darkreader-inline-bgcolor: #212425;"
    data-darkreader-inline-bgcolor="">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" data-darkreader-inline-border-top="" data-darkreader-inline-border-right=""
            data-darkreader-inline-border-bottom="" data-darkreader-inline-border-left=""
            style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left; --darkreader-inline-border-top: initial; --darkreader-inline-border-right: initial; --darkreader-inline-border-bottom: initial; --darkreader-inline-border-left: initial;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: left;">
                    <div style="padding-bottom: 20px;" align="center"><img src="https://cdn.jsdelivr.net/gh/unknownpersonog/unknownvps-client@assets/png/server.png" alt="Company" style="width: 56px;"></div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255); --darkreader-inline-bgcolor: #181a1b;"
                    data-darkreader-inline-bgcolor="">
                    <div style="color: rgb(0, 0, 0); text-align: left; --darkreader-inline-color: #e8e6e3;" data-darkreader-inline-color="">
                      <h1 style="margin: 1rem 0;" align="center">Verification code</h1>
                      <p style="padding-bottom: 16px;" align="center">Please use the verification code below to sign in.</p>
                      <p style="padding-bottom: 16px; font-size: 30px; " align="center"><strong style="font-size: 130%">${verificationToken}</strong></p>
                      <p style="padding-bottom: 16px;" align="center">If you didn’t request this, you can ignore this email.</p>
                      <p style="padding-bottom: 16px" align="center">Thanks,<br> ${process.env.COMPANY_NAME}</p>
                    </div>
                  </div>
                  <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center; --darkreader-inline-color: #a8a095;"
                    data-darkreader-inline-color="">
                    <p style="padding-bottom: 16px">By UnknownVPS Ltd.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`,
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email Sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'An error occurred while sending the verification email.' });
  }
});

router.post('/token', async(req: Request, res: Response) => {
  const token = req.body.token;
  const discordId = req.body.discordId;

  if (!token || !discordId) {
    return res.status(404).json({ error: 'Invalid Request' });
  }

  try {
    const user = await DiscordAPI.findOne({ discordId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expiresAt = user.verificationTokenExpiresAt;

    if (!expiresAt || new Date() > expiresAt) {
      await DiscordAPI.findOneAndUpdate(
        { discordId },
        { $unset: { verificationToken: '', verificationTokenExpiresAt: '' } }
      );
      return res.status(400).json({ error: 'Token Expired' });
    }


    if (user.verified === 'true') {
      return res.status(400).json({ error: 'User already verified'});
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

      return res.status(200).json({ message: 'Verified' });
    } else {
      return res.status(404).json({ error: 'Invalid Token' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'An error occurred while verifying the token.' });
  }
});

function generateVerificationToken() {
  const verificationToken = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 60); // Expiration time is set to 60 minutes from now
  return { verificationToken, expiresAt };
}


export default router;
