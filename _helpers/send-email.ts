import nodemailer from 'nodemailer';
import config from "../config.json";

function getSmtpOptions() {
    if (process.env.NODE_ENV === 'production' && !process.env.SMTP_HOST) {
        throw 'SMTP_HOST environment variable is required in production to send emails';
    }

    if (process.env.SMTP_HOST) {
        return {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS
                ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
                : undefined
        };
    }

    if (!config.smtpOptions) throw 'SMTP configuration is missing';

    return config.smtpOptions;
}

function getEmailFrom() {
    return process.env.EMAIL_FROM || config.emailFrom;
}

export default async function sendEmail({to,subject,html, from =  getEmailFrom() }:any) {
    const transporter = nodemailer.createTransport(getSmtpOptions());
    await transporter.sendMail({from, to, subject,html});
}