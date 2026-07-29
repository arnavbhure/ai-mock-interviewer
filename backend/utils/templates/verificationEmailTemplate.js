const verificationEmailTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 20px;">
<tr>
<td align="center">

<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center" style="background:#2563eb;padding:32px;">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">
AI Mock Interviewer
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2 style="margin:0 0 16px;color:#111827;font-size:24px;">
Verify your email
</h2>

<p style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;">
Welcome! Thanks for creating your account.
Use the verification code below to verify your email address and continue.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:36px 0;">

<div style="
display:inline-block;
padding:18px 40px;
background:#eff6ff;
border:2px dashed #2563eb;
border-radius:10px;
font-size:36px;
font-weight:700;
letter-spacing:10px;
color:#2563eb;
">
${otp}
</div>

</td>
</tr>
</table>

<p style="margin:0 0 14px;font-size:15px;color:#4b5563;line-height:1.8;">
This verification code is valid for
<strong>10 minutes</strong>.
</p>

<p style="margin:0 0 14px;font-size:15px;color:#4b5563;line-height:1.8;">
For your security, never share this OTP with anyone.
Our team will never ask for your verification code.
</p>

<p style="margin:0;font-size:15px;color:#4b5563;line-height:1.8;">
If you didn't create an account, you can safely ignore this email.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:24px;background:#f9fafb;border-top:1px solid #e5e7eb;">

<p style="margin:0;font-size:13px;color:#6b7280;">
© ${new Date().getFullYear()} AI Mock Interviewer. All rights reserved.
</p>

<p style="margin:10px 0 0;font-size:13px;color:#6b7280;">
Developed with ❤️ by
<a
href="https://www.linkedin.com/in/arnavbhure"
target="_blank"
rel="noopener noreferrer"
style="color:#2563eb;text-decoration:none;font-weight:600;"
>
~arnavbhure
</a>
</p>

<p style="margin-top:12px;font-size:12px;color:#9ca3af;">
This is an automated email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = { verificationEmailTemplate };
