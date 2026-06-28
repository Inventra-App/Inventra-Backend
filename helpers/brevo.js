require("dotenv").config();
const BrevoClient = require("@getbrevo/brevo");
const SupermarketModel = require("../models/supermarket");

const brevoClient = new BrevoClient.TransactionalEmailsApi();

brevoClient.setApiKey(
    BrevoClient.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const brevo = async (userEmail, userName, html) => {
    try {
        const sendSmtpEmail = new BrevoClient.SendSmtpEmail();

        sendSmtpEmail.sender = {
            email: "mehandxum2017@gmail.com",
            name: "Inventra"
        };

        sendSmtpEmail.to = [
            {
                email: userEmail,
                name: userName
            }
        ];

        sendSmtpEmail.subject = "Inventra";
        sendSmtpEmail.htmlContent = html;

        const response = await brevoClient.sendTransacEmail(sendSmtpEmail);

        console.log("Email sent:", response);

    } catch (error) {
       await SupermarketModel.findOneAndDelete({ email: userEmail });
        console.log(
            "Brevo full error:",
            error.response?.body || error.message
        );

        throw new Error(
            error?.response?.body?.message || "Failed to send email"
        );
    }
};

module.exports = { brevo };
// module.exports = { brevo };
