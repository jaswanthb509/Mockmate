const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is missing.");
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
      throw new Error("BREVO_SENDER_EMAIL is missing.");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "MockMate",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo email error:", data);
      throw new Error(
        data?.message || "Unable to send email."
      );
    }

    console.log(`Email sent successfully to ${to}`);
    console.log(`Message ID: ${data.messageId}`);

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export default sendEmail;