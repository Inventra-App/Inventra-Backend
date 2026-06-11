const staffModel = require('../models/staff');
const userModel = require('../models/supermarket');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createStaff = async (req, res, next) => {
    try {
        const adminId = req.user.id;
        console.log(adminId)
        const admin = await userModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                message: `You are not authourised to perform this action. Please contact your administrator`
            })
        }

        const {
            firstName,
            lastName,
            password,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = `${firstName.toLowerCase()}${Math.floor(Math.random() * 10000)}`;
        console.log(username)

        const staff = new staffModel({
            adminId,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            role
        });

        await staff.save();

        res.status(201).json({
            message: "Staff created successfully",
            data: staff
        })

    } catch (error) {
        next(error)
    }
}

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