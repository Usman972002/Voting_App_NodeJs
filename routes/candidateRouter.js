const express = require('express');
const router = express.Router();
const candidate = require("../models/candidate");
const user = require('../models/user');

const isAdmin = async (userId) => {
    try {
        const userDetails = await user.findById(userId);
        return userDetails.role === 'admin';
    } catch (err) {
        console.log(err);
        return false;
    }
}

// Create a Candidate
router.post('/', async (req, res) => {
    try {
        if (!await isAdmin(req.user.id)) {
            res.status(403).json({ message: "Only Admins Has Access" });
        } else {
            const data = req.body;
            const newCandidate = new candidate(data);
            const response = await newCandidate.save();
            console.log('New Candidate Created');
            res.status(200).json({ message: "Candidate Created Successfully", response: response })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


// Update Candidate
router.put('/:candidateId', async (req, res) => {
    try {
        if (!isAdmin(req.user.id)) {
            res.status(403).json({ message: "Only Admins Has Access" });
        } else {

            const candidateId = req.params.candidateId;
            const updatedCandidateData = req.body;

            const response = await candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
                new: true,
                runValidators: true,
            })

            if (!response) {
                return res.status(404).json({ message: "Candidate Not Found" })
            } else {
                console.log("Candidate Upodated")
                res.status(200).json({ message: "Candidate Updated Successfullty", response: response })
            }

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

// Delete Candidate
router.delete('/:candidateId', async (req, res) => {
    try {
        if (!isAdmin(req.user.id)) {
            res.status(403).json({ message: "Only Admins Has Access" });
        } else {
            const candidateId = req.params.candidateId;

            const response = await candidate.findByIdAndDelete(candidateId)

            if (!response) {
                return res.status(404).json({ message: "Candidate Not Found" })
            } else {
                console.log("Candidate Deleted")
                res.status(200).json({ message: "Candidate Deleted Successfully", response: response })
            }

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
})


module.exports = router;