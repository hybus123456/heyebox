import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.qq.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: { user, pass },
    }),
    user,
    pass,
    from: process.env.SMTP_FROM || user,
  };
}

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  const { transporter, user, pass, from } = createTransporter();

  if (!user || !pass) {
    console.warn("[邮件] SMTP未配置，验证码打印到控制台");
    console.log(`[验证码] ${email}: ${code}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"荷叶box" <${from}>`,
      to: email,
      subject: "荷叶box - 登录验证码",
      html: `
        <div style="max-width: 500px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #18181b; margin: 0;">荷叶box</h1>
            <p style="color: #71717a; margin-top: 8px;">个人工具箱门户</p>
          </div>
          
          <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center;">
            <p style="color: #18181b; font-size: 16px; margin-bottom: 16px;">您的登录验证码：</p>
            <div style="font-size: 36px; font-weight: bold; color: #18181b; letter-spacing: 8px; font-family: monospace;">
              ${code}
            </div>
            <p style="color: #71717a; font-size: 14px; margin-top: 16px;">
              验证码 10 分钟内有效，请勿泄露给他人
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px; color: #a1a1aa; font-size: 12px;">
            <p>如果这不是您的操作，请忽略此邮件</p>
          </div>
        </div>
      `,
    });

    console.log(`[邮件] 验证码已发送至 ${email}`);
    return true;
  } catch (error) {
    console.error("[邮件] 发送失败:", error);
    return false;
  }
}
