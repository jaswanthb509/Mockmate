import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER is missing.");
    }

    if (!process.env.EMAIL_APP_PASSWORD) {
      throw new Error("EMAIL_APP_PASSWORD is missing.");
    }

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"MockMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    console.log(`Message ID: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("Email sending error:", error);

    throw new Error(
      error.message || "Unable to send email."
    );
  }
};

export default sendEmail;