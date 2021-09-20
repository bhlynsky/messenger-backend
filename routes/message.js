const router = require('express').Router();
const Message = require('../models/Message');
const Group = require('../models/Group');

//get single message
router.get('/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        !message &&
            res.status(404).json({ message: 'This message does not exist' });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get messages for user
router.get('/user/:userId', async (req, res) => {
    try {
        const groups = await Group.find({
            members: { $in: req.params.userId },
        });

        let messagesFromAllGroups = [];

        for (const group of groups) {
            const groupMessages = await Message.find({
                groupId: group.id,
            }).sort({ createdAt: 'asc' });

            messagesFromAllGroups.push({
                groupId: group.id,
                groupMessages,
            });
        }

        res.status(200).json(messagesFromAllGroups);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;
