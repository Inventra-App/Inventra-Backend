const signUpOtpTemplate = (userName, otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Inventra OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">

	<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fb; padding:40px 0;">
		<tr>
			<td align="center">

				<table width="600" cellpadding="0" cellspacing="0" border="0"
					style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">

					<!-- Header -->
					<tr>
						<td align="center"
							style="background:#111827; padding:32px 24px;">
							<h1 style="margin:0; color:#ffffff; font-size:32px; font-weight:bold;">
								Inventra
							</h1>

							<p style="margin:10px 0 0; color:#9ca3af; font-size:14px;">
								Smart Inventory & Supermarket Management
							</p>
						</td>
					</tr>

					<!-- Body -->
					<tr>
						<td style="padding:40px 32px;">

							<h2 style="margin:0 0 16px; color:#111827; font-size:24px;">
								Verify Your Email
							</h2>

							<p style="margin:0 0 24px; color:#4b5563; font-size:16px; line-height:1.7;">
								Hello, ${userName}! Welcome to Inventra. <br> Use the verification code below to complete your sign up process.
							</p>

							<!-- OTP Box -->
							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="center">

										<div style="
											display:inline-block;
											background:#f3f4f6;
											padding:18px 40px;
											border-radius:10px;
											border:1px solid #e5e7eb;
											font-size:36px;
											font-weight:bold;
											letter-spacing:8px;
											color:#111827;
										">
											${otp}
										</div>

									</td>
								</tr>
							</table>    

							<p style="margin:28px 0 0; color:#6b7280; font-size:14px; line-height:1.7;">
								This code will expire in <strong>10 minutes</strong>.
							</p>

							<p style="margin:12px 0 0; color:#6b7280; font-size:14px; line-height:1.7;">
								If you did not request this verification, you can safely ignore this email.
							</p>

						</td>
					</tr>

					<!-- Footer -->
					<tr>
						<td style="
							padding:24px 32px;
							background:#f9fafb;
							border-top:1px solid #e5e7eb;
							text-align:center;
						">

							<p style="margin:0; color:#9ca3af; font-size:13px;">
								© 2026 Inventra. All rights reserved.
							</p>

						</td>
					</tr>

				</table>

			</td>
		</tr>
	</table>

</body>
</html>
`
}

module.exports = {
    signUpOtpTemplate
}


