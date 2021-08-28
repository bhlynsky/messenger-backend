const router = require('express').Router();
const Group = require('../models/Group');

//new group
router.post('/', async (req, res) => {
    const newGroup = new Group({
        member: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(200).json(savedGroup);
    } catch (err) {
        res.status(500).json(err);
    }
});
//get groups for user

module.exports = router;
