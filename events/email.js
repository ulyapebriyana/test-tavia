import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "a1fe83ccb0a301",
        pass: "578f8e8984044f",
    },
});

export const sendEmailVerification = async (recipient, encodedEmail) => {
    await transporter.sendMail({
        from: "test-tavia@gmail.com", // sender address
        to: `${recipient}`, // list of receivers
        subject: "Hello this email for verifycaton", // Subject line
        text: `click this link to activate your account http://localhost:8000/verify-email/${encodedEmail}`, // plain text body
    });
}

export const sendForgotPassword = async (recipient, encodedEmail) => {
    await transporter.sendMail({
        from: "test-tavia@gmail.com", // sender address
        to: `${recipient}`, // list of receivers
        subject: "Hello this email forgot password", // Subject line
        text: `this is link to reset your password http://localhost:8000/reset-password/${encodedEmail}`, // plain text body
    });
}

