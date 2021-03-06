import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import dotenv from "dotenv";
dotenv.config();

async function sendEmail(receiverEmail: string, verificationLink) {
  try {
    let transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY,
      })
    );

    let info = await transporter.sendMail({
      from: `"TownSquare" LUOXIAO1106@gmail.com`,
      to: receiverEmail,
      subject: "TownSquare Verification",
      // html: `<p>Please click on the following link to verify your email: http://34.145.97.81/user/verify?id=${verificationLink}</p>`,
      html: `<p>Please click on the following link to verify your email: ${process.env.CLIENT}/user/verify?id=${verificationLink}</p>`,
    });
  } catch (err) {
    console.log(err);
  }
}

export default sendEmail;
