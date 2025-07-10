import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: 'vitalii.kostenko@ukr.net',
        pass: process.env.EMAIL_PASS,
    },
};

const transporter = nodemailer.createTransport(config);
const emailOptions = {
    from: 'vitalii.kostenko@ukr.net',
    to: 'apelsin16@gmail.com',
    subject: 'Nodemailer test',
    text: 'Привіт. Ми тестуємо надсилання листів!',
};

transporter
    .sendMail(emailOptions)
    .then(info => console.log(info))
    .catch(err => console.log(err));
