const router = require('express').Router();
const Message = require('../models/Message');
const Group = require('../models/Group');

router.post('/new', async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get messages for group(probably useless)
router.get('/:groupId', async (req, res) => {
    try {
        const messages = await Message.find({
            groupId: req.params.groupId,
        });
        res.status(200).json(messages);
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

        let messagesFromAllGroups = await Promise.all(
            groups.map(async (group) => {
                return await Message.find({
                    groupId: group.id,
                });
            })
        );

        res.status(200).json(messagesFromAllGroups);
    } catch (error) {
        res.status(500).json(err);
    }
});
module.exports = router;
