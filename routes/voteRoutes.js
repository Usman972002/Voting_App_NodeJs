const express = require('express');
const router = express.Router();
const candidate = require("../models/candidate");
const user = require('../models/user');
const { jwtMiddleWare, generateToken } = require('../jwt');

// Vote
router.post('/:candidateId',jwtMiddleWare,async (req, res) => {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    try {
        const candidateDetails = await candidate.findById(candidateId);
        if (!candidateDetails) {
            return res.status(404).json({ message: "Candidate Niot Found" });
        }

        const userDetails = await user.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ message: "User Not Found" })
        }

        if (userDetails.isVoted) {
            return res.status(400).json({ message: "You have already Voted" })
        }

        if (userDetails.role === 'admin') {
            return res.status(403).json({ message: "Admin can not Vote" })
        }

        // Update Candidate
        candidateDetails.votes.push({ user: userId });
        candidateDetails.voteCount++;
        await candidateDetails.save();

        // Update User
        userDetails.isVoted = true;
        await userDetails.save();

        res.status(200).json({ message: `You have Voted Successfully to : ${candidateDetails.name}` })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }

})

// Vote Count
router.get('/count',async(req,res)=>{
    try{
        const candidateDetails = await candidate.find().sort({voteCount:'desc'});

        const voteRecord = candidateDetails.map((data)=>{
            return {
                party:data.party,
                count:data.voteCount
            }
        })

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })    
    }
})

module.exports = router;