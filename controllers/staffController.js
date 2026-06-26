const staffModel = require('../models/staff');
const SupermarketModel = require('../models/supermarket');
const { staffInviteTemplate } = require('../helpers/emailTemplates');
const { brevo } = require('../helpers/brevo');
const { logActivity, filterRole } = require('../helpers/helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otp = require('otp-generator');
const sendMail = require('../helpers/nodemailer');

exports.createStaff = async (req, res, next) => {  
    try {
        const adminId = req.user.id;
        const admin = await SupermarketModel.findById(adminId);
        const genPass = await otp.generate(10, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true, digits: true })
        if (!admin) {
            return res.status(404).json({
                message: `You are not authourised to perform this action. Please contact your administrator`
            })
        }

        const {
            firstName,
            lastName,  
            email,
            role
        } = req.body;

        const checkExistingEmail = await staffModel.findOne({email: email.toLowerCase()})
        // console.log(checkExistingEmail)
        console.log(email)
        if (checkExistingEmail) {
            return res.status(500).json({
                message: `Staff already exist. Please proceed to login`
            })
        }

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
        console.log(staff)
        await staff.save()
        
        const roleLinks = {
            manager: 'https://inventra-app.vercel.app/staff-login',
            cashier: 'https://inventra-app.vercel.app/cashier-login'
        };

        const link = roleLinks[staff.role];

        const info = process.env.NODE_ENV
        if (info === "production") {
             await brevo(staff.email, staff.firstName, staffInviteTemplate(staff.firstName, staff.email, genPass, link))   
        } else{
             await sendMail({
                email: staff.email, 
                subject: 'Welcome', 
                html: staffInviteTemplate(staff.firstName, staff.email, genPass, link)
            })
        }


        res.status(201).json({
            message: "Staff created successfully",  
            data: staff  
        })

    } catch (error) {
        console.log(error)
        next(error)
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
        const { email, password } = req.body;
        
        const staff = await staffModel.findOne({ email: email.toLowerCase() });
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

        staff.isActive = true;
        staff.isVerified = true;

        await staff.save()


       const token = jwt.sign( 
            { 
            id: staff._id,      
            role: staff.role, 
            name: staff.firstName },
            process.env.SECRET_KEY,
            { expiresIn: '1day' }
        )

        await logActivity({
            supermarket: staff.adminId || null,
            staffId: staff._id,
            staffName: `${staff.firstName} ${staff.lastName}`,
            title: 'Login successful',
            module: 'AUTH',
            description: `Staff login successful for ${staff.firstName}`,
            entityId: staff._id
        });

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

exports.getAllStaff = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        const supermarketId = await filterRole(id, role);

        const staff = await staffModel.find({
            adminId: supermarketId
        }).select('-password');

        if (!staff) {
            return [];
  ``      }

        res.status(200).json({
            message: 'Staff fetched successfully',
            data: staff
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};  