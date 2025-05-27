import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({

  host: "sandbox.smtp.mailtrap.io",

  port: 2525,

  auth: {
    user: process.env.NODEMAILER_EMAIL_USER,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD
  }
});