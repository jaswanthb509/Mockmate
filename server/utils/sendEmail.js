import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing.");
      throw new Error("Email service is not configured.");
    }

    const { data, error } = await resend.emails.send({
      from: "MockMate <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message || "Unable to send email.");
    }

    console.log(`Email sent successfully to ${to}`);
    console.log(`Message ID: ${data.id}`);

    return data;
  } catch (error) {
    console.error("Email sending error:", error);

    throw new Error("Unable to send email.");
  }
};

export default sendEmail;