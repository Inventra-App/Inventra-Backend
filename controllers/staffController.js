const staffModel = require('../models/staff');
const userModel = require('../models/supermarket');
const { staffInviteTemplate } = require('../helpers/emailTemplates');
const { sendBrevoEmail} = require('../helpers/brevo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otp = require('otp-generator')


exports.createStaff = async (req, res, next) => {
    try {
        const adminId = req.user.id;

        const admin = await userModel.findById(adminId);

        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            });
        }

        const {
            firstName,
            lastName,
            email,
            role
        } = req.body;

        // This is to check if the staff was already existing before
        const existingStaff = await staffModel.findOne({
            email: email.toLowerCase()
        });

        if (existingStaff) {
            return res.status(400).json({
                message: `Staff with this email already exists`
            });
        }

        
        const genPass = await otp.generate(10, {
            lowerCaseAlphabets: true,
            upperCaseAlphabets: true,
            specialChars: true,
            digits: true
        });

        const username = `${firstName.toLowerCase()}${Math.floor(Math.random() * 10000)}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(genPass, salt);

        const staff = new staffModel({
            adminId,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            email: email.toLowerCase(),
            role
        });

        await staff.save();

        const emailOptions = {
            email: staff.email,
            subject: `Welcome to ${admin.businessName}`,
            html: staffInviteTemplate(staff.username, genPass)
        };

        await sendBrevoEmail(emailOptions);

        res.status(201).json({
            message: "Staff created successfully",
            data: staff
        });

    } catch (error) {
        next(error);
    }
};





// previous code 
// exports.createStaff = async (req, res, next) => {
//     try {
//         const adminId = req.user.id;
//         const admin = await userModel.findById(adminId);
//         const genPass = await otp.generate(10, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true, digits: true })
//         if (!admin) {
//             return res.status(404).json({
//                 message: `You are not authourised to perform this action. Please contact your administrator`
//             })
//         }

//         const {
//             firstName,
//             lastName,
//             email,
//             role
//         } = req.body;

//         const username = `${firstName.toLowerCase()}${Math.floor(Math.random() * 10000)}`;

//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(genPass, salt)

//         const staff = new staffModel({
//             adminId,
//             firstName,
//             lastName,
//             username,
//             password: hashedPassword,
//             email,
//             role
//         });
//         // console.log(staff)

//             //    await  brevo(staff.email, staff.firstName, staffInviteTemplate(staff.firstName, link))

//             const emailOptions = {
//                 email: staff.email,
//                 subject: `welcome to ${admin.businessName}`,
//                 html: staffInviteTemplate(staff.username, genPass)
//             };

//             await sendBrevoEmail(emailOptions)

//         res.status(201).json({
//             message: "Staff created successfully",
//             data: staff  
//         })

//     } catch (error) {
//         next(error)
//     }
// };

exports.loginStaff = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const staff = await staffModel.findOne({ username: username.toLowerCase() });
        if (!staff) {
            return res.status(404).json({
                message: `Invalid credentials. Please contact your administrator.`
            })
        }

        const checkPassword = await bcrypt.compare(password, staff.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: `Invalid credentials. Please contact your administrator`
            })
        }


    
       const token = jwt.sign(
        { 
        id: staff._id,      
        role: staff.role, 
        name: staff.firstName },
        process.env.SECRET_KEY,
       { expiresIn: '1day' }
)

        // const token = await jwt.sign(
        //     {staffId: staff._id, role: staff.role, name: staff.firstName},
        //     process.env.SECRET_KEY,
        //     { expiresIn: '1day'}
        // )

        res.status(200).json({
            message: `Login sucesssful. You may pass!`,
            data: staff,
            token
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.requestPasswordChange = async (req, res, next) => {
    try {
        const { username } = req.body;


        // collect and send to admin notification table
    } catch (error) {
        next(error)
    }
}