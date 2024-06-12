const express = require('express');
const router = express.Router();

const user = require('../models/user');
const { jwtMiddleWare, generateToken } = require('../jwt');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new user(data);
        const response = await newUser.save();
        console.log('New User Created');
        const payload = {
            id : response.id
        }
        const token = generateToken(payload);
        res.status(200).json({response: response, token: token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { aadharNumber, password } = req.body;

        const userDetails = await user.findOne({ aadharNumber: aadharNumber });
        if (!userDetails) {
            res.status(401).json({ message: "Invalid User" });
        } else {
            const passwordMatch = await userDetails.comparePassword(password);
            if (!passwordMatch) {
                res.status(401).json({ message: "Invalid Password" });
            } else {
                const payload = {
                    id : userDetails.id
                }
                const token = generateToken(payload);
                res.status(200).json(token);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: "Internal Server Error" });
    }
})

// Profile 
router.get('/profile', jwtMiddleWare, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const userFound = await user.findById(userId);
        res.status(200).json(userFound);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// Update Password
router.put('/profile/password',jwtMiddleWare,async(req,res)=>{
    try{
        const userId = req.user;
        const {currentPassword,newPassword} = req.body;

        if(currentPassword === newPassword){
            return res.status(401).json({message: "New Password is same as Current Password , Try With Different Password"})
        }
        const userDetails = await user.findById(userId.id);
        const passwordMatch = await userDetails.comparePassword(currentPassword);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid Password" });
        } else {  
            userDetails.password = newPassword;
            await userDetails.save();
            res.status(200).json({message:"Password Updated Successfully"});
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

module.exports = router;