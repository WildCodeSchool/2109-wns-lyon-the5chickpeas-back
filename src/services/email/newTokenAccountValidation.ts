import { User } from "../../models/User";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

export async function sendRefreshToken(token: string, user: User) {
  
  // TODO : Send Email - Check if DEV or PROD later
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const url = `${process.env.FRONT_URI_VALIDATE_ACCOUNT}${token}`;

  var mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: `${user.email}`,
    subject: `Please take in account your new token ${user.pseudo}`,
    text: `Here is your new token validation link : ${url}`,
  };

  return await transporter.sendMail(mailOptions);
}
