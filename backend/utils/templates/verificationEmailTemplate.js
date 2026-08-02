const verificationEmailTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Verify Your Email</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
</head>

<body style="margin:0;padding:0;background-color:#F8FAFC;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!--[if mso]>
<center>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;">
<tr><td>
<![endif]-->

<!-- Hidden preheader: shown as preview text in most inboxes -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F8FAFC;">
Verify your email address with InterviewAI. Your one-time verification code is ready.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F8FAFC" style="background-color:#F8FAFC;padding:40px 16px;">
<tr>
<td align="center" style="padding:40px 16px;">

<!-- Main card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.08);">
<tr>
<td>

<!-- ============ HEADER ============ -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#EEF4FF" style="background-color:#EEF4FF;padding:48px 32px 40px 32px;">
<!--[if gte mso 9]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
<v:fill type="gradient" color="#EEF4FF" color2="#DBEAFE" angle="180" />
<v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
<![endif]-->

<!-- Logo lockup (email-safe text logo) -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
<tr>
<td align="center" valign="middle" style="padding:0 8px 0 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
<tr>
<td align="center" valign="middle" bgcolor="#2563EB" style="background-color:#2563EB;border-radius:10px;height:36px;width:36px;">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:36px;width:36px;" arcsize="50%" fillcolor="#2563EB" strokecolor="#2563EB">
<w:anchorlock/>
<center>
<![endif]-->
<span style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:700;line-height:36px;color:#FFFFFF;text-decoration:none;letter-spacing:-1px;">AI</span>
<!--[if mso]>
</center>
</v:roundrect>
<![endif]-->
</td>
</tr>
</table>
</td>
<td align="left" valign="middle">
<span style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:-0.5px;color:#111827;line-height:36px;">Interview<span style="color:#2563EB;">AI</span></span>
</td>
</tr>
</table>

<!-- Badge -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:24px auto 0 auto;">
<tr>
<td align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:999px;padding:8px 20px;border:1px solid #E5E7EB;">
<span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;color:#2563EB;text-transform:uppercase;">Email Verification</span>
</td>
</tr>
</table>

<!--[if gte mso 9]>
</v:textbox>
</v:rect>
<![endif]-->
</td>
</tr>
</table>

<!-- ============ BODY ============ -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="padding:48px 40px 40px 40px;">

<h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;line-height:1.25;color:#111827;">
Verify Your Email
</h1>

<p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#6B7280;">
Welcome to InterviewAI. Use the verification code below to confirm your email address and finish setting up your account.
</p>

<!-- OTP card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:40px;">
<tr>
<td align="center" bgcolor="#EFF6FF" style="background-color:#EFF6FF;border-radius:16px;border:1px solid #BFDBFE;padding:40px 24px;">
<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:520px;height:auto;">
<v:fill color="#EFF6FF" />
<v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
<![endif]-->

<p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;color:#2563EB;text-transform:uppercase;">
Your Verification Code
</p>

<div style="font-family:'Courier New',Courier,monospace;font-size:38px;font-weight:700;letter-spacing:12px;line-height:1.3;color:#2563EB;padding:0 0 0 12px;">
${otp}
</div>

<p style="margin:20px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6B7280;">
This code expires in 10 minutes.
</p>

<!--[if mso]>
</v:textbox>
</v:rect>
<![endif]-->
</td>
</tr>
</table>

<!-- Security notice -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
<tr>
<td align="left" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:16px;border:1px solid #E5E7EB;padding:24px 28px;">
<p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#6B7280;text-transform:uppercase;">
Security Notice
</p>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td valign="top" width="24" style="width:24px;padding:0 0 10px 0;">
<span style="display:inline-block;width:18px;height:18px;background-color:#ECFDF5;border-radius:999px;text-align:center;line-height:18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#22C55E;">&#10003;</span>
</td>
<td valign="middle" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111827;">Valid for <strong>10 minutes</strong> from request.</td>
</tr>
<tr>
<td valign="top" width="24" style="width:24px;padding:0 0 10px 0;">
<span style="display:inline-block;width:18px;height:18px;background-color:#ECFDF5;border-radius:999px;text-align:center;line-height:18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#22C55E;">&#10003;</span>
</td>
<td valign="middle" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111827;">Never share this OTP with anyone.</td>
</tr>
<tr>
<td valign="top" width="24" style="width:24px;padding:0;">
<span style="display:inline-block;width:18px;height:18px;background-color:#ECFDF5;border-radius:999px;text-align:center;line-height:18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#22C55E;">&#10003;</span>
</td>
<td valign="middle" style="padding:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111827;">InterviewAI will never ask for your verification code.</td>
</tr>
</table>
</td>
</tr>
</table>

<p style="margin:32px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#9CA3AF;">
If you didn&rsquo;t request this code, you can safely ignore this email. Your account remains secure.
</p>

</td>
</tr>
</table>

<!-- ============ FOOTER ============ -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#F8FAFC" style="background-color:#F8FAFC;border-top:1px solid #E5E7EB;padding:32px 40px 40px 40px;">

<span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;letter-spacing:-0.3px;color:#111827;">Interview<span style="color:#2563EB;">AI</span></span>

<p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6B7280;">
&copy; ${new Date().getFullYear()} InterviewAI &middot; Built with <span style="color:#EF4444;">&hearts;</span> by <a href="https://www.linkedin.com/in/arnavbhure" target="_blank" style="color:#2563EB;text-decoration:none;font-weight:600;">Arnav Bhure</a>
</p>

<p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#9CA3AF;">
You received this email because an account was created with this address on InterviewAI. This is an automated message &mdash; please do not reply.
</p>

</td>
</tr>
</table>

</td>
</tr>
</table>

</td>
</tr>
</table>

<!--[if mso]>
</td></tr>
</table>
</center>
<![endif]-->

</body>
</html>
`;
};

module.exports = { verificationEmailTemplate };
