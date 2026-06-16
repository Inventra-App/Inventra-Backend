
const {BrevoClient} = require('@getbrevo/brevo');

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
})

exports.sendBrevoEmail = async(options)=>{
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: options.subject,
            htmlContent: options.html,
            sender: {
                name: 'Inventra',
                email: process.env.ADMIN_EMAIL
            },
            to: [{ email: options.email }]
        })
        console.log(`email successfully sent to ${options.email}`)


    } catch (error) {
        console.log(`error while sending email to ${options.email}`, error.message)
    }
}












// // const BrevoClient = require("@getbrevo/brevo");

// // const brevoClient = new BrevoClient.TransactionalEmailsApi();
// // brevoClient.setApiKey(
// //     BrevoClient.TransactionalEmailsApiApiKeys.apiKey,
// //     process.env.BREVO_API_KEY
// // );

// // const sendMail = async (userEmail, userName, html) => {
// //     try {
// //         const sendSmtpEmail = new BrevoClient.SendSmtpEmail();

// //         const data = {
// //             htmlContent: `<html><body><p>Hello ${userName},</p><p>Welcome to Inventra!</p></body></html>`,
// //             sender: {
// //                 email: "app.inventra@gmail.com",
// //                 name: "Nana from Inventra"
// //             },
// //             subject: "Welcome to Inventra!"
// //         };

// //         sendSmtpEmail.to = [
// //             {
// //                 email: userEmail
// //             }
// //         ];

// //         sendSmtpEmail.subject = data.subject;
// //         sendSmtpEmail.htmlContent = html;
// //         sendSmtpEmail.sender = data.sender;

// //         await brevoClient.sendTransacEmail(sendSmtpEmail);

// //     } catch (error) {
// //         const message =
// //             error?.response?.body?.message ||
// //             error?.message ||
// //             "Failed to send email via Brevo";

// //         const statusCode =
// //             error?.statusCode ||
// //             error?.status ||
// //             500;

// //         const wrapped = new Error(`Brevo email error: ${message}`);
// //         wrapped.statusCode = statusCode;

// //         throw wrapped;
// //     }
// // };

// // module.exports = { sendMail };






// // const BrevoClient = require("@getbrevo/brevo");

// // const brevoClient = new BrevoClient.TransactionalEmailsApi();
// // brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// // const brevo = async (userEmail, userName, html) => {
// //     try {
// //         const sendSmtpEmail = new BrevoClient.SendSmtpEmail();
// //         const data = {
// //             htmlContent: `<html><head></head><body><p>Hello ${userName} ,</p>Welcome to backend!.</p></body></html>`,
// //             sender: {
// //                 email: "app.inventra@gmail.com",
// //                 name: "Inventra",
// //             },
// //             subject: "Welcome to Inventra!",
// //         };
// //         sendSmtpEmail.to = [{
// //             email: userEmail
// //         }];
// //         sendSmtpEmail.subject = data.subject;
// //         sendSmtpEmail.htmlContent = html;
// //         sendSmtpEmail.sender = data.sender;

// //         await brevoClient.sendTransacEmail(sendSmtpEmail);
// //     } catch (error) {
// //         const message = error?.response?.body?.message || error?.message || 'Failed to send email via Brevo';
// //         const statusCode = error?.statusCode || error?.status || 500;
// //         const wrapped = new Error(`Brevo email error: ${message}`);
// //         wrapped.statusCode = statusCode;
// //         throw wrapped;
// //     }
// // };

// // module.exports = {brevo};

// const BrevoClient = require("@getbrevo/brevo");
// require("dotenv").config();

// const brevoClient = new BrevoClient.TransactionalEmailsApi();

// brevoClient.setApiKey(
//     BrevoClient.TransactionalEmailsApiApiKeys.apiKey,
//     process.env.BREVO_API_KEY
// );

// const brevo = async (userEmail, userName, html) => {
//     try {
//         const sendSmtpEmail = new BrevoClient.SendSmtpEmail();

//         sendSmtpEmail.sender = {
//             email: "mehandxum2017@gmail.com",
//             name: "Inventra"
//         };

//         sendSmtpEmail.to = [
//             {
//                 email: userEmail,
//                 name: userName
//             }
//         ];

//         sendSmtpEmail.subject = "Inventra";
//         sendSmtpEmail.htmlContent = html;

//         const response = await brevoClient.sendTransacEmail(sendSmtpEmail);

//         console.log("Email sent:", response);

//     } catch (error) {
//         console.log(
//             "Brevo full error:",
//             error.response?.body || error.message
//         );

//         throw new Error(
//             error?.response?.body?.message || "Failed to send email"
//         );
//     }
// };

// module.exports = { brevo };