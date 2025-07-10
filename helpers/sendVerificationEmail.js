import nodemailer from 'nodemailer';

const { EMAIL_PASS, BASE_URL } = process.env;

const config = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: 'vitalii.kostenko@ukr.net',
        pass: EMAIL_PASS,
    },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
    
    const emailOptions = {
        from: 'vitalii.kostenko@ukr.net',
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>If you didn't request this verification, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(emailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

export default sendVerificationEmail; 