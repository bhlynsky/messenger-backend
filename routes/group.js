const router = require('express').Router();
const Group = require('../models/Group');

//new group
router.post('/new', async (req, res) => {
    const newGroup = new Group({
        groupName: req.body.groupName,
        members: req.body.members,
        lastMessage: '',
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(200).json(savedGroup);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get groups for user
router.get('/:userId', async (req, res) => {
    try {
        const groups = await Group.find({
            members: { $in: [req.params.userId] },
        });

        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
