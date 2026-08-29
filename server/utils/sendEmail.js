import nodemailer from "nodemailer";

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error("Email credentials are missing.");
      console.error(
        "EMAIL_USER:",
        emailUser ? "Loaded" : "Missing"
      );
      console.error(
        "EMAIL_APP_PASSWORD:",
        emailPassword ? "Loaded" : "Missing"
      );

      throw new Error(
        "Email credentials are not configured."
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"MockMate" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Email sent successfully to ${to}`
    );

    console.log(
      `Message ID: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      "Email sending error:",
      error
    );

    throw new Error(
      "Unable to send email."
    );
  }
};

export default sendEmail;