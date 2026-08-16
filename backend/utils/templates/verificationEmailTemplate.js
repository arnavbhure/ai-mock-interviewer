const LOGO_URL = `${process.env.FRONTEND_URL}/src/public/Logo.png`;

const verificationEmailTemplate = (otp) => {
  console.log(LOGO_URL);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />

  <title>Verify your InterviewAI account</title>

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

<body
  style="
    margin:0;
    padding:0;
    background:#f5f7fa;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  "
>

<!-- Hidden preview text -->
<div
  style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:transparent;
    font-size:1px;
    line-height:1px;
  "
>
  Your InterviewAI verification code is ${otp}. It expires in 10 minutes.
</div>

<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#f5f7fa;"
>
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- Main container -->
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          max-width:600px;
          background:#ffffff;
          border:1px solid #e5e7eb;
        "
      >

        <!-- ================= HEADER ================= -->

        <tr>
          <td
            style="
              padding:28px 36px;
              border-bottom:1px solid #e5e7eb;
              background:#ffffff;
            "
          >

            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>

                <!-- Logo mark -->
                  <td
                    valign="middle"
                    style="padding-right:12px;"
                  >
                    <img
                      src="${LOGO_URL}"
                      alt="InterviewAI"
                      width="36"
                      height="36"
                      style="
                        display:block;
                        width:36px;
                        height:36px;
                        border:0;
                        outline:none;
                        text-decoration:none;
                      "
                    />
                  </td>

                <!-- Logo text -->
                <td valign="middle">
                  <span
                    style="
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:19px;
                      line-height:34px;
                      font-weight:700;
                      letter-spacing:-0.5px;
                      color:#111827;
                    "
                  >
                    Interview<span style="color:#2563eb;">AI</span>
                  </span>
                </td>

              </tr>
            </table>

          </td>
        </tr>


        <!-- ================= GRID / HERO ================= -->

        <tr>
          <td
            style="
              padding:0;
              background-color:#fafafa;
              background-image:
                linear-gradient(#e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
              background-size:28px 28px;
            "
          >

            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>
                <td
                  align="center"
                  style="
                    padding:52px 36px;
                    background:rgba(250,250,250,0.92);
                  "
                >

                  <!-- Small label -->
                  <p
                    style="
                      margin:0 0 18px 0;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:11px;
                      line-height:1;
                      font-weight:700;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#2563eb;
                    "
                  >
                    Account Verification
                  </p>

                  <h1
                    style="
                      margin:0;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:32px;
                      line-height:1.2;
                      font-weight:700;
                      letter-spacing:-1px;
                      color:#111827;
                    "
                  >
                    Verify your email
                  </h1>

                  <p
                    style="
                      max-width:430px;
                      margin:16px auto 0 auto;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:15px;
                      line-height:1.7;
                      color:#6b7280;
                    "
                  >
                    You're one step away from starting smarter,
                    personalized mock interviews with InterviewAI.
                  </p>

                </td>
              </tr>
            </table>

          </td>
        </tr>


        <!-- ================= OTP ================= -->

        <tr>
          <td
            align="center"
            style="
              padding:44px 36px 20px 36px;
              background:#ffffff;
            "
          >

            <p
              style="
                margin:0 0 12px 0;
                font-family:Arial,Helvetica,sans-serif;
                font-size:12px;
                line-height:1.4;
                font-weight:700;
                letter-spacing:1.5px;
                text-transform:uppercase;
                color:#6b7280;
              "
            >
              Your verification code
            </p>

            <!-- OTP -->
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin:0 auto;"
            >
              <tr>

                <td
                  align="center"
                  style="
                    padding:18px 26px;
                    border:1px solid #dbe3ef;
                    background:#f8fafc;
                  "
                >
                  <span
                    style="
                      font-family:'Courier New',Courier,monospace;
                      font-size:34px;
                      line-height:1.2;
                      font-weight:700;
                      letter-spacing:10px;
                      color:#111827;
                    "
                  >
                    ${otp}
                  </span>
                </td>

              </tr>
            </table>

            <p
              style="
                margin:16px 0 0 0;
                font-family:Arial,Helvetica,sans-serif;
                font-size:13px;
                line-height:1.6;
                color:#6b7280;
              "
            >
              This code expires in <strong style="color:#111827;">10 minutes</strong>.
            </p>

          </td>
        </tr>


        <!-- ================= DIVIDER ================= -->

        <tr>
          <td style="padding:20px 36px 0 36px;">
            <div
              style="
                height:1px;
                background:#e5e7eb;
                line-height:1px;
                font-size:1px;
              "
            >
              &nbsp;
            </div>
          </td>
        </tr>


        <!-- ================= SECURITY ================= -->

        <tr>
          <td
            style="
              padding:28px 36px 36px 36px;
              background:#ffffff;
            "
          >

            <p
              style="
                margin:0 0 14px 0;
                font-family:Arial,Helvetica,sans-serif;
                font-size:12px;
                line-height:1.4;
                font-weight:700;
                letter-spacing:1.2px;
                text-transform:uppercase;
                color:#9ca3af;
              "
            >
              Security
            </p>

            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >

              <tr>
                <td
                  valign="top"
                  width="22"
                  style="padding:0 10px 10px 0;"
                >
                  <span
                    style="
                      color:#2563eb;
                      font-size:14px;
                      font-weight:700;
                    "
                  >
                    ✓
                  </span>
                </td>

                <td
                  style="
                    padding:0 0 10px 0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:13px;
                    line-height:1.6;
                    color:#4b5563;
                  "
                >
                  Your code is valid for 10 minutes.
                </td>
              </tr>

              <tr>
                <td
                  valign="top"
                  width="22"
                  style="padding:0 10px 10px 0;"
                >
                  <span
                    style="
                      color:#2563eb;
                      font-size:14px;
                      font-weight:700;
                    "
                  >
                    ✓
                  </span>
                </td>

                <td
                  style="
                    padding:0 0 10px 0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:13px;
                    line-height:1.6;
                    color:#4b5563;
                  "
                >
                  Never share your verification code with anyone.
                </td>
              </tr>

              <tr>
                <td
                  valign="top"
                  width="22"
                  style="padding:0 10px 0 0;"
                >
                  <span
                    style="
                      color:#2563eb;
                      font-size:14px;
                      font-weight:700;
                    "
                  >
                    ✓
                  </span>
                </td>

                <td
                  style="
                    padding:0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:13px;
                    line-height:1.6;
                    color:#4b5563;
                  "
                >
                  InterviewAI will never ask you for this code.
                </td>
              </tr>

            </table>

          </td>
        </tr>


        <!-- ================= FOOTER ================= -->

<tr>
  <td
    align="center"
    style="
      padding:24px 36px 30px 36px;
      background:#f8fafc;
      border-top:1px solid #e5e7eb;
    "
  >

    <p
      style="
        margin:0;
        font-family:Arial,Helvetica,sans-serif;
        font-size:13px;
        line-height:1.6;
        color:#6b7280;
      "
    >
      Didn't request this code?
      <span style="color:#111827;">
        You can safely ignore this email.
      </span>
    </p>

    <!-- Developer credit -->
    <p
      style="
        margin:18px 0 0 0;
        font-family:Arial,Helvetica,sans-serif;
        font-size:12px;
        line-height:1.6;
        color:#9ca3af;
      "
    >
      Developed with
      <span
        style="
          color:#ef4444;
          font-size:14px;
          font-weight:700;
        "
      >
        ♥
      </span>
      by
      <a
        href="https://linkedin.com/in/arnavbhure"
        target="_blank"
        style="
          color:#111827;
          font-weight:600;
          text-decoration:none;
        "
      >
        ~arnavbhure
      </a>
    </p>

    <p
      style="
        margin:10px 0 0 0;
        font-family:Arial,Helvetica,sans-serif;
        font-size:12px;
        line-height:1.6;
        color:#9ca3af;
      "
    >
      © ${new Date().getFullYear()} InterviewAI
    </p>

  </td>
</tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>`;
};

module.exports = { verificationEmailTemplate };
