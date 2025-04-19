import { createTransport, SendMailOptions } from "nodemailer";

export const sendEmail = async (data: SendMailOptions) => {
    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"test code 👻" <${process.env.EMAIL}>`,
            ...data
        });

        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};
