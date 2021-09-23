const router = require('express').Router();
const Group = require('../models/Group');
const User = require('../models/User');

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

        !group && res.status(404).json({ message: 'Group no found' });

        group.members = group.members.concat(newUsers);

        const updatedGroup = await Group.updateOne(
            { _id: groupId },
            { members: group.members }
        );

        !updatedGroup && res.status(400).json({ message: "Can't save group" });
        // return members to update client state
        res.status(200).json(group.members);
    } catch (err) {
        res.status(500).json({ message: `Error ${err}` });
    }
});

module.exports = router;
