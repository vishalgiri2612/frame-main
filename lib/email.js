import nodemailer from "nodemailer";

function getTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("Missing SMTP configuration env vars");
  }

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }),
    smtpUser,
  };
}

export async function sendResetCodeEmail({ to, code }) {
  const { transporter, smtpUser } = getTransporter();
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const subject = "Your password reset code";
  const text = `Your reset code is ${code}. It expires in 10 minutes.`;

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    text,
  });
}
