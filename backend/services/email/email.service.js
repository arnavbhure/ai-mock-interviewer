const axios = require("axios");

const sendEmail = async ({ to, subject, htmlContent }) => {
  const recipients = Array.isArray(to)
    ? to.map((email) => ({ email }))
    : [{ email: to }];

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "Interview AI",
        email: process.env.EMAIL_USER,
      },
      to: recipients,
      subject,
      htmlContent,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

module.exports = { sendEmail };
