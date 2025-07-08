import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const sendVerificationEmail = async (to, verificationToken) => {
    const verifyUrl = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;

    const emailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Please verify your email',
        html: `<p>Click the link to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`
    };

    await transporter.sendMail(emailOptions);
};

export default sendVerificationEmail;
