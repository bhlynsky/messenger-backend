const router = require('express').Router();
const Group = require('../models/Group');
const errors = require('../services/constants');

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
            members: { $elemMatch: { userId: req.params.userId } },
        });

        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json(err);
    }
});

//add user/users to group

router.put('/addusers/:groupId', async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const newUsers = req.body;

        let group = await Group.findById(groupId);

        !group && res.status(404).json({ message: errors.GROUP_NOT_FOUND });

        group.members = group.members.concat(newUsers);

        const updatedGroup = await Group.updateOne(
            { _id: groupId },
            { members: group.members }
        );

        !updatedGroup &&
            res.status(400).json({ message: errors.GROUP_SAVE_ERROR });
        // return members to update client state
        res.status(200).json(group.members);
    } catch (err) {
        res.status(500).json({ message: `Error ${err}` });
    }
});

router.put('/removeUser', async (req, res) => {
    const userId = req.body.userId;
    const groupId = req.body.groupId;

    try {
        const group = await Group.findById(groupId);

        !group && res.status(404).json({ message: errors.GROUP_NOT_FOUND });

        const newMembers = group.members.filter((user) => {
            if (userId !== user.userId) {
                return user;
            }
        });

        const updatedGroup = await Group.updateOne(
            { _id: groupId },
            { members: newMembers }
        );

        !updatedGroup &&
            res.status(500).json({ message: errors.GROUP_SAVE_ERROR });

        res.status(200).json(newMembers);
    } catch (err) {
        res.status(500).json({ message: `Error ${err}` });
    }
});

module.exports = router;
