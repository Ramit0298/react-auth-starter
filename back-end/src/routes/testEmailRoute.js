import { sendEmail } from "../util/sendEmail";

export const testEmailRoute = {
  path: "/api/test-email",
  method: "post",
  handler: async (req, res) => {
    try {
      await sendEmail({
        to: "raj.linklearn+test@gmail.com",
        from: "raj.linklearn@gmail.com",
        subject: "Test Email from LinkLearn",
        text: "This is a test email sent from LinkLearn.",
        html: "<strong>This is a test email sent from LinkLearn.</strong>",
      });
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email", error });
    }
  },
};
