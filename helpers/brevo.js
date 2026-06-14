// const BrevoClient = require("@getbrevo/brevo");

// const brevoClient = new BrevoClient.TransactionalEmailsApi();
// brevoClient.setApiKey(
//     BrevoClient.TransactionalEmailsApiApiKeys.apiKey,
//     process.env.BREVO_API_KEY
// );

// const sendMail = async (userEmail, userName, html) => {
//     try {
//         const sendSmtpEmail = new BrevoClient.SendSmtpEmail();

//         const data = {
//             htmlContent: `<html><body><p>Hello ${userName},</p><p>Welcome to Inventra!</p></body></html>`,
//             sender: {
//                 email: "app.inventra@gmail.com",
//                 name: "Nana from Inventra"
//             },
//             subject: "Welcome to Inventra!"
//         };

//         sendSmtpEmail.to = [
//             {
//                 email: userEmail
//             }
//         ];

//         sendSmtpEmail.subject = data.subject;
//         sendSmtpEmail.htmlContent = html;
//         sendSmtpEmail.sender = data.sender;

//         await brevoClient.sendTransacEmail(sendSmtpEmail);

//     } catch (error) {
//         const message =
//             error?.response?.body?.message ||
//             error?.message ||
//             "Failed to send email via Brevo";

//         const statusCode =
//             error?.statusCode ||
//             error?.status ||
//             500;

//         const wrapped = new Error(`Brevo email error: ${message}`);
//         wrapped.statusCode = statusCode;

//         throw wrapped;
//     }
// };

// module.exports = { sendMail };






const BrevoClient = require("@getbrevo/brevo");

const brevoClient = new BrevoClient.TransactionalEmailsApi();
brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const brevo = async (userEmail, userName, html) => {
    try {
        const sendSmtpEmail = new BrevoClient.SendSmtpEmail();
        const data = {
            htmlContent: `<html><head></head><body><p>Hello ${userName} ,</p>Welcome to backend!.</p></body></html>`,
            sender: {
                email: "app.inventra@gmail.com",
                name: "Nana from Inventra",
            },
            subject: "Welcome to Inventra!",
        };
        sendSmtpEmail.to = [{
            email: userEmail
        }];
        sendSmtpEmail.subject = data.subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = data.sender;

        await brevoClient.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        const message = error?.response?.body?.message || error?.message || 'Failed to send email via Brevo';
        const statusCode = error?.statusCode || error?.status || 500;
        const wrapped = new Error(`Brevo email error: ${message}`);
        wrapped.statusCode = statusCode;
        throw wrapped;
    }
};

module.exports = {brevo};