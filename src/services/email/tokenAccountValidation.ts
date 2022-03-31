import { User } from "../../models/User";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

export async function sendTokenNewUser(token: string, user: User) {
  // TODO : Send Email - Check if DEV or PROD later
  const transporter = nodemailer.createTransport({
    host: "maildev",
    port: 25,
    secure: false,
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const url = `${process.env.FRONT_URI_VALIDATE_ACCOUNT}${token}`;

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: `${user.email}`,
    subject: `Thanks for your register ${user.pseudo}`,
    text: `To confirm your account, please click the following url : ${url}`,
  };

  return await transporter.sendMail(mailOptions);
}
