import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        console.log('Nodemailer connection error:', error.message);
    } else {
        console.log('Nodemailer is ready to send emails');
    }
});

export default transporter;
